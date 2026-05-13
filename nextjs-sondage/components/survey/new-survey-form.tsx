"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";
import { createSurveyAction } from "@/app/sondages/actions";

export function NewSurveyForm() {
  const [rows, setRows] = useState(() => ["", "", ""]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [resultsPrivate, setResultsPrivate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filledCount = useMemo(() => rows.map((r) => r.trim()).filter(Boolean).length, [rows]);
  const canSubmit = Boolean(title.trim()) && filledCount >= 2;

  const setRow = useCallback((i: number, v: string) => {
    setRows((prev) => prev.map((x, j) => (j === i ? v : x)));
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, ""]);
  }, []);

  const removeRow = useCallback((i: number) => {
    setRows((prev) => (prev.length <= 2 ? prev : prev.filter((_, j) => j !== i)));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options = rows.map((r) => r.trim()).filter(Boolean);
    if (!title.trim() || options.length < 2) return;
    startTransition(() => {
      void createSurveyAction({
        title: title.trim(),
        description: description.trim(),
        endsAt: endsAt.trim() || null,
        resultsPrivate,
        options,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-10 px-8 py-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Nouveau Sondage</h1>
        <p className="text-base text-secondary">Concevez votre questionnaire avec clarté et précision.</p>
      </div>

      <GlassPanel className="space-y-6 rounded-xl p-8">
        <div className="flex items-center gap-3 text-primary">
          <MaterialIcon name="edit_note" />
          <h2 className="text-2xl font-semibold">Détails du sondage</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="title" className="px-1 text-sm font-medium tracking-wide text-primary">
              Titre du sondage
            </label>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full rounded-lg px-4 py-2 text-on-surface outline-none placeholder:text-outline-variant"
              placeholder="Ex : Satisfaction trimestrielle Q4"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="description" className="px-1 text-sm font-medium tracking-wide text-primary">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input w-full resize-none rounded-lg px-4 py-2 text-on-surface outline-none placeholder:text-outline-variant"
              placeholder="Expliquez brièvement l’objectif de ce sondage…"
            />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="space-y-6 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <MaterialIcon name="list" />
            <h2 className="text-2xl font-semibold">Options de réponse</h2>
          </div>
          <span className="text-sm font-medium text-secondary">
            {filledCount} option{filledCount > 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-3">
          {rows.map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={val}
                onChange={(e) => setRow(i, e.target.value)}
                className="glass-input min-w-0 flex-1 rounded-lg px-4 py-2 text-on-surface outline-none"
                placeholder="Texte de l’option…"
                aria-label={`Option ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="rounded-lg p-2 text-red-700 transition-colors hover:bg-red-50"
                aria-label="Supprimer l’option"
              >
                <MaterialIcon name="delete" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-secondary">Au moins deux options non vides sont requises.</p>
        <button
          type="button"
          onClick={addRow}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 py-3 font-bold text-primary transition-all hover:border-primary/60 active:scale-[0.98]"
        >
          <MaterialIcon name="add_circle" />
          Ajouter une option
        </button>
      </GlassPanel>

      <GlassPanel className="space-y-6 rounded-xl p-8">
        <div className="flex items-center gap-3 text-primary">
          <MaterialIcon name="settings" />
          <h2 className="text-2xl font-semibold">Paramètres avancés</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="glass-input flex items-center justify-between rounded-lg p-4">
            <label htmlFor="private" className="cursor-pointer">
              <p className="text-sm font-bold text-on-surface">Sondage privé</p>
              <p className="text-xs text-secondary">Résultats réservés aux organisateurs si coché</p>
            </label>
            <input
              id="private"
              name="private"
              type="checkbox"
              checked={resultsPrivate}
              onChange={(e) => setResultsPrivate(e.target.checked)}
              className="h-5 w-5 rounded border-primary text-primary"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="endsAt" className="px-1 text-sm font-medium text-primary">
              Date d&apos;expiration
            </label>
            <div className="relative">
              <input
                id="endsAt"
                name="endsAt"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="glass-input w-full appearance-none rounded-lg px-4 py-2 pr-10 text-on-surface outline-none"
              />
              <MaterialIcon
                name="calendar_today"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
              />
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="flex flex-col items-center justify-between gap-6 pt-4 md:flex-row">
        <p className="flex items-center gap-2 text-sm text-secondary">
          <MaterialIcon name="info" className="text-lg" />
          Publication immédiate (démo).
        </p>
        <div className="flex w-full gap-4 md:w-auto">
          <button
            type="button"
            className="flex-1 rounded-full border border-primary px-8 py-3 font-bold text-primary transition-colors hover:bg-primary/5 md:flex-none"
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isPending}
            className="flex-1 rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
          >
            {isPending ? "Publication…" : "Publier le sondage"}
          </button>
        </div>
      </div>
    </form>
  );
}
