"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Checkbox,
  Input,
  Label,
  TextField,
  Select,
  ListBox,
  Modal,
} from "@heroui/react";
import { SHOWS, getTicketPrice, Show } from "@/lib/shows";

const TODAY = new Date().toISOString().split("T")[0];
const SESSION_KEY = "registro_auth";

const THEATER_LABELS: Record<string, string> = {
  university: "Universidad del Saarland",
};

function getTheaterDisplay(theaterKey: string): string {
  return THEATER_LABELS[theaterKey] ?? theaterKey;
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setPasswordError("");
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onSuccess();
      } else {
        setPasswordError("Contraseña incorrecta");
        setPasswordInput("");
      }
    } catch {
      setPasswordError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="container mx-auto flex-1 px-4 py-8 flex flex-col items-center justify-center gap-6 max-w-sm">
      <h2 className="text-2xl font-bold text-center text-red-600">
        Registro de venta
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 bg-white p-10 rounded-2xl text-black [--foreground:#171717]"
      >
        <TextField className="w-full" onChange={setPasswordInput}>
          <Label>Contraseña</Label>
          <Input type="password" value={passwordInput} autoFocus />
        </TextField>
        {passwordError && (
          <p className="text-sm text-red-600 text-center">{passwordError}</p>
        )}
        <Button
          type="submit"
          variant="primary"
          isDisabled={!passwordInput || isChecking}
          className="w-full bg-red-800 text-white"
        >
          {isChecking ? "..." : "Entrar"}
        </Button>
      </form>
    </section>
  );
}

type Language = "es" | "en" | "de";

function RegistroForm() {
  const [selectedShowIso, setSelectedShowIso] = useState<string>("");
  const [ticketCount, setTicketCount] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const futureShows = useMemo(
    () => SHOWS.filter((s) => s.isoDate >= TODAY),
    []
  );

  const show: Show | undefined = futureShows.find(
    (s) => s.isoDate === selectedShowIso
  );
  const isDayOf = show?.isoDate === TODAY;
  const pricePerTicket = show ? getTicketPrice(isStudent, isDayOf, show.theater) : 0;
  const total = ticketCount * pricePerTicket;

  const tierLabel = show
    ? isStudent
      ? isDayOf ? "estudiante · taquilla" : "estudiante · preventa"
      : isDayOf ? "precio normal · taquilla" : "precio normal · preventa"
    : "";

  const isFormValid = !!show && !!name.trim() && ticketCount >= 1;

  const handleRegistration = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim() || undefined,
          show: {
            city: show!.city,
            theater: show!.theater,
            date: show!.date,
            isoDate: show!.isoDate,
          },
          tickets: ticketCount,
          isStudent,
          language,
        }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      setReservationId(data.reservationId);
      setIsConfirmed(true);
    } catch {
      setError("Error al registrar la venta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setReservationId("");
    setSelectedShowIso("");
    setTicketCount(1);
    setName("");
    setEmail("");
    setIsStudent(false);
  };

  return (
    <section className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6 max-w-xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600">
        Registro de venta
      </h2>
      <p className="text-center text-sm text-gray-400">
        Uso interno · Venta en taquilla
      </p>

      <div className="flex w-full flex-wrap flex-col gap-4 bg-white p-16 rounded-2xl text-black [--foreground:#171717]">
        {futureShows.length === 0 ? (
          <p className="text-center text-gray-500">No hay funciones disponibles</p>
        ) : (
          <>
            <Select
              className="max-w-xs text-black"
              placeholder="Selecciona la función"
              value={selectedShowIso}
              onChange={(value) => setSelectedShowIso(value as string)}
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
                      textValue={`${s.date} — ${getTheaterDisplay(s.theater)}`}
                    >
                      {s.date} — {getTheaterDisplay(s.theater)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <div className="flex flex-col gap-1">
              <Label>Número de entradas</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketCount((n) => Math.max(1, n - 1))}
                  disabled={ticketCount <= 1}
                  className="w-9 h-9 rounded-full border border-gray-300 text-lg font-bold disabled:opacity-30 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{ticketCount}</span>
                <button
                  type="button"
                  onClick={() => setTicketCount((n) => Math.min(10, n + 1))}
                  disabled={ticketCount >= 10}
                  className="w-9 h-9 rounded-full border border-gray-300 text-lg font-bold disabled:opacity-30 flex items-center justify-center"
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

            <TextField className="max-w-xs" onChange={setName}>
              <Label>Nombre del comprador</Label>
              <Input value={name} />
            </TextField>

            <TextField className="max-w-xs" onChange={setEmail}>
              <Label>
                Correo electrónico{" "}
                <span className="text-xs text-gray-400 font-normal">(opcional)</span>
              </Label>
              <Input type="email" value={email} />
            </TextField>

            <div className="flex flex-col gap-1">
              <Label>Idioma del correo</Label>
              <div className="flex gap-2">
                {(["es", "en", "de"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
                      language === lang
                        ? "bg-red-800 text-white border-red-800"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {show && (
              <div className="flex justify-between items-center py-2 px-1 border-t">
                <div>
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-xs text-gray-500">
                    Precio por entrada: €{pricePerTicket} ({tierLabel})
                  </p>
                </div>
                <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
              </div>
            )}

            {!isFormValid && (
              <p className="text-sm text-gray-500 text-center">
                Selecciona función, introduce el nombre y la cantidad de entradas
              </p>
            )}

            <Button
              variant="primary"
              isDisabled={!isFormValid || isLoading}
              onPress={handleRegistration}
              className="w-full bg-red-800 text-white"
            >
              {isLoading ? "..." : "Registrar venta"}
            </Button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </>
        )}
      </div>

      <Modal.Backdrop isOpen={isConfirmed} onOpenChange={() => {}}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="text-green-700">
                ¡Venta registrada!
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>La venta ha sido registrada correctamente en la base de datos.</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <strong>Función:</strong> {show?.city}
                </p>
                <p>
                  <strong>Fecha:</strong> {show?.date}
                </p>
                <p>
                  <strong>Entradas:</strong> {ticketCount} × €{pricePerTicket} ({tierLabel})
                </p>
                <p>
                  <strong>Total:</strong> €{total.toFixed(2)}
                </p>
                <p>
                  <strong>Comprador:</strong> {name}
                </p>
                <p>
                  <strong>ID de registro:</strong>{" "}
                  <span className="font-mono text-xs">{reservationId}</span>
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onPress={handleReset}
                className="bg-red-800 text-white"
              >
                Registrar otra venta
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </section>
  );
}

export default function Registro() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <RegistroForm />;
}
