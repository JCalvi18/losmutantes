"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Checkbox, Label, Select, ListBox } from "@heroui/react";
import { SHOWS, getTicketPrice } from "@/lib/shows";
import type { Show } from "@/lib/shows";

const SESSION_KEY = "checkin_auth";
const TODAY = new Date().toISOString().split("T")[0];

const THEATER_LABELS: Record<string, string> = {
  university: "Universidad del Saarland",
  schloss: "Schloss",
};
function theaterLabel(key: string) {
  return THEATER_LABELS[key.toLowerCase()] ?? key;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanResult = {
  found: boolean;
  collection?: string;
  status?: string;
  name?: string;
  show?: { city: string; theater: string; date: string };
  tickets?: number;
  isStudent?: boolean;
  checkedInAt?: string | null;
};

type PendingEntry = {
  name: string;
  reservationId: string;
  tickets: number;
  isStudent: boolean;
};

type PendingData = { entries: PendingEntry[]; showDate: string };

// ─── Client-side cache for pending list (5-min TTL) ───────────────────────────

let pendingCache: (PendingData & { fetchedAt: number }) | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchPendingList(force = false): Promise<PendingData> {
  if (!force && pendingCache && Date.now() - pendingCache.fetchedAt < CACHE_TTL) {
    return { entries: pendingCache.entries, showDate: pendingCache.showDate };
  }
  try {
    const res = await fetch("/api/checkin/pending");
    if (res.ok) {
      const data: PendingData = await res.json();
      pendingCache = { ...data, fetchedAt: Date.now() };
      return data;
    }
  } catch {}
  return { entries: [], showDate: "" };
}

// ─── PasswordGate ─────────────────────────────────────────────────────────────

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onSuccess();
      } else {
        setErr("Contraseña incorrecta");
        setPw("");
      }
    } catch {
      setErr("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container mx-auto flex-1 px-4 py-12 flex flex-col items-center justify-center gap-6 max-w-sm">
      <h2 className="text-2xl font-bold text-center text-orange-700">
        Control de entrada
      </h2>
      <form
        onSubmit={submit}
        className="w-full flex flex-col gap-4 bg-white p-10 rounded-2xl text-black [--foreground:#171717]"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Contraseña
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </label>
        {err && <p className="text-sm text-red-600 text-center">{err}</p>}
        <Button
          type="submit"
          variant="primary"
          isDisabled={!pw || busy}
          className="w-full bg-orange-700 text-white"
        >
          {busy ? "..." : "Entrar"}
        </Button>
      </form>
    </section>
  );
}

// ─── ModeSelector ─────────────────────────────────────────────────────────────

type Mode = "validar" | "taquilla" | "lista";

function ModeSelector({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <section className="container mx-auto flex-1 px-4 py-12 flex flex-col items-center justify-center gap-8 max-w-sm">
      <h2 className="text-2xl font-bold text-center text-orange-700">
        Control de entrada
      </h2>
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={() => onSelect("validar")}
          className="w-full py-8 rounded-2xl bg-green-600 text-white text-xl font-bold hover:bg-green-700 transition-colors"
        >
          Validar entrada
        </button>
        <button
          onClick={() => onSelect("taquilla")}
          className="w-full py-8 rounded-2xl bg-orange-700 text-white text-xl font-bold hover:bg-orange-800 transition-colors"
        >
          Registrar venta
        </button>
        <button
          onClick={() => onSelect("lista")}
          className="w-full py-8 rounded-2xl bg-blue-700 text-white text-xl font-bold hover:bg-blue-800 transition-colors"
        >
          Ver lista
        </button>
      </div>
    </section>
  );
}

// ─── ScannerView ──────────────────────────────────────────────────────────────

function ScannerView({
  onScan,
  onCameraError,
}: {
  onScan: (text: string) => void;
  onCameraError: (msg: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onScanRef = useRef(onScan);
  const onCameraErrorRef = useRef(onCameraError);
  useEffect(() => {
    onScanRef.current = onScan;
    onCameraErrorRef.current = onCameraError;
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let locked = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch {
        onCameraErrorRef.current(
          "No se pudo acceder a la cámara. Verifica los permisos."
        );
        return;
      }

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.play().catch(() => {}); // stream starts via srcObject; play() may throw AbortError on mobile

      const jsQR = (await import("jsqr")).default;

      intervalId = setInterval(() => {
        if (locked) return;
        const v = videoRef.current;
        const c = canvasRef.current;
        if (!v || !c || v.readyState < 2) return;
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(v, 0, 0);
        const img = ctx.getImageData(0, 0, c.width, c.height);
        const code = jsQR(img.data, img.width, img.height);
        if (code) {
          locked = true;
          onScanRef.current(code.data);
        }
      }, 150);
    }

    start();

    return () => {
      if (intervalId) clearInterval(intervalId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black min-h-[280px]">
      <video
        ref={videoRef}
        muted
        playsInline
        className="w-full"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 border-2 border-white rounded-xl opacity-60" />
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ─── ValidarEntrada ───────────────────────────────────────────────────────────

function ValidarEntrada({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<"scanning" | "loading" | "result">(
    "scanning"
  );
  const [scanKey, setScanKey] = useState(0);
  const [cameraErr, setCameraErr] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [currentMongoId, setCurrentMongoId] = useState("");
  const [pendingList, setPendingList] = useState<PendingEntry[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  async function handleScan(mongoId: string) {
    setPhase("loading");
    setCurrentMongoId(mongoId);
    try {
      const res = await fetch(
        `/api/checkin?mongoId=${encodeURIComponent(mongoId)}`
      );
      const data: ScanResult = await res.json();
      setScanResult(data);
      if (!data.found) {
        setPendingLoading(true);
        const cached = await fetchPendingList();
        setPendingList(cached.entries);
        setPendingLoading(false);
      }
    } catch {
      setScanResult({ found: false });
    }
    setPhase("result");
  }

  async function handleCheckin() {
    setCheckingIn(true);
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mongoId: currentMongoId }),
    }).catch(() => null);
    if (res?.ok) setCheckedIn(true);
    setCheckingIn(false);
  }

  function handleRescan() {
    setScanResult(null);
    setPendingList([]);
    setCheckedIn(false);
    setCameraErr("");
    setScanKey((k) => k + 1);
    setPhase("scanning");
  }

  function cardStyle(result: ScanResult) {
    if (!result.found)
      return {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-700",
        label: "QR no reconocido",
      };
    if (result.status === "checked_in")
      return {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-700",
        label: "Ya validado",
      };
    if (result.status === "pending_payment")
      return {
        bg: "bg-orange-50",
        border: "border-orange-400",
        text: "text-orange-700",
        label: "Pago pendiente",
      };
    if (result.status === "paid" || result.status === "confirmed")
      return {
        bg: "bg-green-50",
        border: "border-green-500",
        text: "text-green-700",
        label: "Entrada válida",
      };
    return {
      bg: "bg-gray-50",
      border: "border-gray-400",
      text: "text-gray-700",
      label: result.status ?? "Desconocido",
    };
  }

  const canCheckin =
    scanResult?.found &&
    (scanResult.status === "paid" || scanResult.status === "confirmed");

  return (
    <section className="container mx-auto flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-orange-700">Validar entrada</h2>
      </div>

      {phase === "scanning" && (
        <>
          {cameraErr ? (
            <p className="text-sm text-red-600 text-center p-4 bg-red-50 rounded-xl">
              {cameraErr}
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Apunta la cámara al código QR del ticket
            </p>
          )}
          <ScannerView
            key={scanKey}
            onScan={handleScan}
            onCameraError={setCameraErr}
          />
        </>
      )}

      {phase === "loading" && (
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500">Verificando...</p>
        </div>
      )}

      {phase === "result" && scanResult &&
        (() => {
          const style = cardStyle(scanResult);
          return (
            <div
              className={`border-2 rounded-2xl p-6 flex flex-col gap-3 ${style.bg} ${style.border}`}
            >
              <p className={`text-lg font-bold ${style.text}`}>{style.label}</p>
              {scanResult.found && (
                <>
                  <p className="text-sm text-black">
                    <strong>Nombre:</strong> {scanResult.name}
                  </p>
                  <p className="text-sm text-black">
                    <strong>Función:</strong> {scanResult.show?.city}
                  </p>
                  <p className="text-sm text-black">
                    <strong>Fecha:</strong> {scanResult.show?.date}
                  </p>
                  <p className="text-sm text-black">
                    <strong>Entradas:</strong> {scanResult.tickets}
                  </p>
                  {scanResult.isStudent && (
                    <p className="text-sm font-medium text-blue-700">
                      Estudiante — verificar carnet
                    </p>
                  )}
                  {scanResult.status === "checked_in" &&
                    scanResult.checkedInAt && (
                      <p className="text-xs text-gray-600">
                        Validado:{" "}
                        {new Date(scanResult.checkedInAt).toLocaleTimeString(
                          "es-DE"
                        )}
                      </p>
                    )}
                </>
              )}

              <div className="flex flex-col gap-2 mt-1">
                {canCheckin && !checkedIn && (
                  <Button
                    variant="primary"
                    onPress={handleCheckin}
                    isDisabled={checkingIn}
                    className="w-full bg-green-600 text-white"
                  >
                    {checkingIn ? "..." : "Marcar entrada"}
                  </Button>
                )}
                {checkedIn && (
                  <p className="text-green-700 font-bold text-center py-2">
                    Entrada confirmada
                  </p>
                )}
                <button
                  onClick={handleRescan}
                  className="w-full py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Escanear siguiente
                </button>
              </div>
            </div>
          );
        })()}

      {phase === "result" && !scanResult?.found && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600 font-medium">
            Reservas pendientes de pago para hoy:
          </p>
          {pendingLoading && (
            <p className="text-sm text-gray-400 text-center">Cargando...</p>
          )}
          {!pendingLoading && pendingList.length === 0 && (
            <p className="text-sm text-gray-400 text-center">
              No hay reservas pendientes
            </p>
          )}
          {!pendingLoading &&
            pendingList.map((entry) => (
              <div
                key={entry.reservationId}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1"
              >
                <p className="font-semibold text-sm text-black">{entry.name}</p>
                <p className="text-xs text-gray-500">
                  ID: {entry.reservationId} · {entry.tickets}{" "}
                  {entry.tickets !== 1 ? "entradas" : "entrada"}
                  {entry.isStudent ? " · estudiante" : ""}
                </p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

// ─── VerLista ─────────────────────────────────────────────────────────────────

function VerLista({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<PendingData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(force = false) {
    setLoading(true);
    const result = await fetchPendingList(force);
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const showInfo = data?.showDate
    ? SHOWS.find((s) => s.isoDate === data.showDate)
    : null;

  return (
    <section className="container mx-auto flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-orange-700">Reservas pendientes</h2>
      </div>

      {data?.showDate && (
        <p className="text-sm text-gray-500 text-center">
          {showInfo
            ? `${showInfo.city} · ${showInfo.date}`
            : data.showDate}
        </p>
      )}

      {loading && (
        <p className="text-gray-400 text-center py-8">Cargando...</p>
      )}

      {!loading && data?.entries.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          No hay reservas pendientes de pago
        </p>
      )}

      {!loading &&
        data?.entries.map((entry) => (
          <div
            key={entry.reservationId}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1"
          >
            <p className="font-semibold text-black">{entry.name}</p>
            <p className="text-xs text-gray-500">
              ID: {entry.reservationId} · {entry.tickets}{" "}
              {entry.tickets !== 1 ? "entradas" : "entrada"}
              {entry.isStudent ? " · estudiante" : ""}
            </p>
          </div>
        ))}

      <button
        onClick={() => load(true)}
        className="text-sm text-gray-500 underline text-center mt-2"
      >
        Actualizar lista
      </button>
    </section>
  );
}

// ─── RegistrarVenta ───────────────────────────────────────────────────────────

function RegistrarVenta({ onBack }: { onBack: () => void }) {
  const futureShows = useMemo(
    () => SHOWS.filter((s) => s.isoDate >= TODAY),
    []
  );
  const defaultShow =
    futureShows.find((s) => s.isoDate === TODAY) ?? futureShows[0] ?? null;

  const [show, setShow] = useState<Show | null>(defaultShow);
  const [selectedIso, setSelectedIso] = useState(defaultShow?.isoDate ?? "");
  const [ticketCount, setTicketCount] = useState(1);
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const pricePerTicket = show ? getTicketPrice(isStudent, true, show.theater) : 0;
  const total = ticketCount * pricePerTicket;

  function handleShowChange(isoDate: string) {
    setSelectedIso(isoDate);
    setShow(futureShows.find((s) => s.isoDate === isoDate) ?? null);
  }

  async function handleSubmit() {
    if (!show) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/taquilla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          show: {
            city: show.city,
            theater: show.theater,
            date: show.date,
            isoDate: show.isoDate,
          },
          tickets: ticketCount,
          isStudent,
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError("Error al registrar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSuccess(false);
    setTicketCount(1);
    setIsStudent(false);
  }

  if (success) {
    return (
      <section className="container mx-auto flex-1 px-4 py-12 flex flex-col items-center gap-6 max-w-sm">
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 flex flex-col gap-4 w-full">
          <p className="text-2xl font-bold text-green-700 text-center">
            Venta registrada
          </p>
          <div className="text-sm text-black space-y-1">
            <p>
              <strong>Función:</strong> {show?.city}
            </p>
            <p>
              <strong>Fecha:</strong> {show?.date}
            </p>
            <p>
              <strong>Entradas:</strong> {ticketCount} × €{pricePerTicket}
            </p>
            {isStudent && (
              <p className="text-blue-700 font-medium">Estudiante</p>
            )}
            <p className="text-lg font-bold mt-2">Total: €{total.toFixed(2)}</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="w-full py-5 rounded-2xl bg-orange-700 text-white font-bold text-lg hover:bg-orange-800 transition-colors"
        >
          Registrar otra venta
        </button>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver al menú
        </button>
      </section>
    );
  }

  return (
    <section className="container mx-auto flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver
        </button>
        <h2 className="text-xl font-bold text-orange-700">Registrar venta</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 flex flex-col gap-5 text-black [--foreground:#171717]">
        {futureShows.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay funciones disponibles
          </p>
        ) : (
          <>
            <Select
              className="w-full text-black"
              placeholder="Selecciona la función"
              value={selectedIso}
              onChange={(value) => handleShowChange(value as string)}
            >
              <Label>Función</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="text-black">
                <ListBox>
                  {futureShows.map((s) => (
                    <ListBox.Item
                      key={s.isoDate}
                      id={s.isoDate}
                      textValue={`${s.date} — ${theaterLabel(s.theater)}`}
                    >
                      {s.date} — {theaterLabel(s.theater)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <div className="flex flex-col gap-2">
              <Label>Número de entradas</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketCount((n) => Math.max(1, n - 1))}
                  disabled={ticketCount <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 text-xl font-bold disabled:opacity-30 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-lg">
                  {ticketCount}
                </span>
                <button
                  type="button"
                  onClick={() => setTicketCount((n) => Math.min(10, n + 1))}
                  disabled={ticketCount >= 10}
                  className="w-10 h-10 rounded-full border border-gray-300 text-xl font-bold disabled:opacity-30 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <Checkbox isSelected={isStudent} onChange={setIsStudent}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>Estudiante</Label>
              </Checkbox.Content>
            </Checkbox>

            {show && (
              <div className="flex justify-between items-center py-3 border-t border-gray-100">
                <div>
                  <p className="text-base font-semibold">Total</p>
                  <p className="text-xs text-gray-500">
                    €{pricePerTicket} × {ticketCount} (taquilla)
                  </p>
                </div>
                <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              variant="primary"
              isDisabled={!show || loading}
              onPress={handleSubmit}
              className="w-full bg-orange-700 text-white"
            >
              {loading ? "..." : "Registrar venta"}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Checkin() {
  const [isAuth, setIsAuth] = useState(false);
  const [mode, setMode] = useState<"select" | Mode>("select");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setIsAuth(true);
  }, []);

  if (!isAuth) return <PasswordGate onSuccess={() => setIsAuth(true)} />;
  if (mode === "validar")
    return <ValidarEntrada onBack={() => setMode("select")} />;
  if (mode === "taquilla")
    return <RegistrarVenta onBack={() => setMode("select")} />;
  if (mode === "lista")
    return <VerLista onBack={() => setMode("select")} />;
  return <ModeSelector onSelect={setMode} />;
}
