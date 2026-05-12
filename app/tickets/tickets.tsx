"use client";

import { useState, useMemo } from "react";
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
import { useLanguage } from "@/app/i18n/LanguageContext";
import { SHOWS, getTicketPrice, Show } from "@/lib/shows";

const TODAY = new Date().toISOString().split("T")[0];

function getTheaterDisplay(theaterKey: string, universityName: string): string {
  return theaterKey === "university" ? universityName : theaterKey;
}

export default function Tickets() {
  const { t, language } = useLanguage();
  const [selectedShowIso, setSelectedShowIso] = useState<string>("");
  const [ticketCount, setTicketCount] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isStudent, setIsStudent] = useState(false);
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
  const pricePerTicket = show ? getTicketPrice(isStudent, isDayOf) : 0;
  const total = ticketCount * pricePerTicket;

  const tierLabel = show
    ? isStudent
      ? isDayOf ? t.tickets.tier_student_day_of : t.tickets.tier_student_early
      : isDayOf ? t.tickets.tier_standard_day_of : t.tickets.tier_standard_early
    : "";

  const isFormValid =
    !!show && !!name.trim() && email.includes("@") && ticketCount >= 1;

  const handleReservation = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
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
      if (!res.ok) throw new Error("Reservation failed");
      const data = await res.json();
      setReservationId(data.reservationId);
      setIsConfirmed(true);
    } catch {
      setError(t.tickets.error);
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
        {t.tickets.title}
      </h2>

      <div className="flex w-full flex-wrap flex-col gap-4 bg-white p-16 rounded-2xl text-black [--foreground:#171717]">
        {futureShows.length === 0 ? (
          <p className="text-center text-gray-500">{t.tickets.no_shows}</p>
        ) : (
          <>
            <Select
              className="max-w-xs text-black"
              placeholder={t.tickets.select_show}
              value={selectedShowIso}
              onChange={(value) => setSelectedShowIso(value as string)}
            >
              <Label>{t.tickets.select_show}</Label>
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
                      textValue={`${s.date} — ${getTheaterDisplay(s.theater, t.home.university)}`}
                    >
                      {s.date} — {getTheaterDisplay(s.theater, t.home.university)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <div className="flex flex-col gap-1">
              <Label>{t.tickets.ticket_count}</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketCount((n) => Math.max(1, n - 1))}
                  disabled={ticketCount <= 1}
                  className="w-9 h-9  rounded-full border border-gray-300 text-lg font-bold disabled:opacity-30 flex items-center justify-center"
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
                <Label>{t.tickets.is_student}</Label>
              </Checkbox.Content>
            </Checkbox>

            <TextField className="max-w-xs" onChange={setName}>
              <Label>{t.tickets.your_name}</Label>
              <Input value={name} />
            </TextField>

            <TextField className="max-w-xs" onChange={setEmail}>
              <Label>{t.tickets.your_email}</Label>
              <Input type="email" value={email} />
            </TextField>

            {show && (
              <div className="flex justify-between items-center py-2 px-1 border-t">
                <div>
                  <p className="text-lg font-semibold">{t.tickets.total}</p>
                  <p className="text-xs text-gray-500">
                    {t.tickets.price_per_ticket}: €{pricePerTicket} ({tierLabel})
                  </p>
                </div>
                <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
              </div>
            )}

            {!isFormValid && (
              <p className="text-sm text-gray-500 text-center">
                {t.tickets.complete_form}
              </p>
            )}

            <Button
              variant="primary"
              isDisabled={!isFormValid || isLoading}
              onPress={handleReservation}
              className="w-full bg-red-800 text-white"
            >
              {isLoading ? "..." : t.tickets.reserve_button}
            </Button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </>
        )}
      </div>

      <Modal.Backdrop isOpen={isConfirmed} onOpenChange={() => { }}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="text-green-700">
                {t.tickets.confirmation_title}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>{t.tickets.confirmation_body}</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <strong>{t.tickets.show_label}:</strong> {show?.city}
                </p>
                <p>
                  <strong>{t.tickets.date_label}:</strong> {show?.date}
                </p>
                <p>
                  <strong>{t.tickets.ticket_count}:</strong> {ticketCount} × €{pricePerTicket} ({tierLabel})
                </p>
                <p>
                  <strong>{t.tickets.total}:</strong> €{total.toFixed(2)}
                </p>
                <p>
                  <strong>{t.tickets.booking_id}:</strong>{" "}
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
                {t.tickets.book_another}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </section>
  );
}
