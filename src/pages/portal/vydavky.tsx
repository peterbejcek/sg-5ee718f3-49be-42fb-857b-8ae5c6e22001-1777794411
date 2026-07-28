"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur } from "@/lib/portalClient";
import { INTERVAL_LABELS, type ExpenseInterval } from "@/lib/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Category = { id: number; nazov: string; aktivna: boolean };
type Expense = {
  id: number; datum: string; popis: string; suma: number; uhradene: boolean;
  pravidelny: boolean; interval: ExpenseInterval | null;
  categoryId: number; kategoria: string; vozidlo: string | null; zdroj: string;
};

const INTERVALS: ExpenseInterval[] = ["TYZDENNE", "MESACNE", "STVRTROCNE", "POLROCNE", "ROCNE"];
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = {
  datum: today(), popis: "", categoryId: "", suma: 0,
  uhradene: false, pravidelny: false, interval: "MESACNE" as ExpenseInterval,
};

export default function VydavkyPage() {
  const { toast } = useToast();
  const [rok, setRok] = useState(new Date().getFullYear());
  const [list, setList] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const loadCats = useCallback(() => {
    apiFetch<{ categories: Category[] }>("/api/portal/expense-categories").then((d) => setCategories(d.categories));
  }, []);
  const load = useCallback(() => {
    apiFetch<{ expenses: Expense[] }>(`/api/portal/expenses?rok=${rok}`).then((d) => setList(d.expenses));
  }, [rok]);
  useEffect(() => { loadCats(); }, [loadCats]);
  useEffect(() => { load(); }, [load]);

  const activeCats = categories.filter((c) => c.aktivna);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, datum: today(), categoryId: activeCats[0] ? String(activeCats[0].id) : "" });
    setOpen(true);
  }
  function openEdit(e: Expense) {
    setEditing(e);
    setForm({
      datum: e.datum.slice(0, 10), popis: e.popis, categoryId: String(e.categoryId), suma: e.suma,
      uhradene: e.uhradene, pravidelny: e.pravidelny, interval: e.interval ?? "MESACNE",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.categoryId) { toast({ title: "Vyberte kategóriu", variant: "destructive" }); return; }
    const payload = {
      datum: form.datum, popis: form.popis, categoryId: Number(form.categoryId), suma: form.suma,
      uhradene: form.uhradene, pravidelny: form.pravidelny,
      interval: form.pravidelny ? form.interval : null,
    };
    try {
      if (editing) await apiFetch(`/api/portal/expenses/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await apiFetch("/api/portal/expenses", { method: "POST", body: JSON.stringify(payload) });
      setOpen(false); load();
      toast({ title: "Uložené" });
    } catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  async function togglePaid(e: Expense) {
    await apiFetch(`/api/portal/expenses/${e.id}`, { method: "PUT", body: JSON.stringify({ uhradene: !e.uhradene }) });
    load();
  }
  async function remove(e: Expense) {
    if (e.zdroj !== "MANUAL") { toast({ title: "Tento výdavok sa spravuje pri vozidle (lízing/poistenie).", variant: "destructive" }); return; }
    if (!confirm(`Zmazať výdavok „${e.popis}"?`)) return;
    try { await apiFetch(`/api/portal/expenses/${e.id}`, { method: "DELETE" }); load(); }
    catch (err) { toast({ title: "Chyba", description: err instanceof Error ? err.message : "", variant: "destructive" }); }
  }

  return (
    <PortalLayout title="Výdavky">
      <Head><title>Výdavky — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="mb-0" onClick={openNew}>+ Pridať výdavok</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Upraviť výdavok" : "Nový výdavok"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Dátum</Label><Input type="date" value={form.datum} onChange={(e) => setForm({ ...form, datum: e.target.value })} /></div>
              <div><Label>Suma (€)</Label><Input type="number" step="0.01" value={form.suma} onChange={(e) => setForm({ ...form, suma: Number(e.target.value) })} /></div>
              <div className="col-span-2"><Label>Popis</Label><Input value={form.popis} onChange={(e) => setForm({ ...form, popis: e.target.value })} /></div>
              <div className="col-span-2">
                <Label>Kategória</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Vyberte kategóriu" /></SelectTrigger>
                  <SelectContent>{activeCats.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nazov}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.pravidelny} onCheckedChange={(v) => setForm({ ...form, pravidelny: !!v })} />
                  Pravidelný výdavok (predpis v intervale)
                </label>
              </div>
              {form.pravidelny && (
                <div className="col-span-2">
                  <Label>Interval</Label>
                  <Select value={form.interval} onValueChange={(v) => setForm({ ...form, interval: v as ExpenseInterval })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INTERVALS.map((i) => <SelectItem key={i} value={i}>{INTERVAL_LABELS[i]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.uhradene} onCheckedChange={(v) => setForm({ ...form, uhradene: !!v })} />
                  Uhradené
                </label>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Uložiť</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={catOpen} onOpenChange={setCatOpen}>
          <DialogTrigger asChild><Button variant="outline" className="mb-0">Kategórie</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Kategórie výdavkov</DialogTitle></DialogHeader>
            <CategoryManager categories={categories} onChange={loadCats} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead><TableHead>Popis</TableHead><TableHead>Kategória</TableHead>
              <TableHead>Suma</TableHead><TableHead>Pravidelný</TableHead><TableHead>Uhradené</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.datum.slice(0, 10)}</TableCell>
                <TableCell className="font-medium">{e.popis}{e.zdroj !== "MANUAL" && <Badge variant="outline" className="ml-2">z vozidla</Badge>}</TableCell>
                <TableCell>{e.kategoria}</TableCell>
                <TableCell>{formatEur(e.suma)}</TableCell>
                <TableCell>{e.pravidelny ? <Badge variant="secondary">{e.interval ? INTERVAL_LABELS[e.interval] : "áno"}</Badge> : "—"}</TableCell>
                <TableCell>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={e.uhradene} onCheckedChange={() => togglePaid(e)} />
                    {e.uhradene ? <Badge className="bg-green-600">Áno</Badge> : <Badge variant="destructive">Nie</Badge>}
                  </label>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(e)}>Upraviť</Button>
                  {e.zdroj === "MANUAL" && <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(e)}>Zmazať</Button>}
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Žiadne výdavky za rok {rok}.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  );
}

function CategoryManager({ categories, onChange }: { categories: Category[]; onChange: () => void }) {
  const { toast } = useToast();
  const [nazov, setNazov] = useState("");

  async function add() {
    if (!nazov.trim()) return;
    try {
      await apiFetch("/api/portal/expense-categories", { method: "POST", body: JSON.stringify({ nazov: nazov.trim() }) });
      setNazov(""); onChange();
    } catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }
  async function toggle(c: Category) {
    await apiFetch(`/api/portal/expense-categories/${c.id}`, { method: "PUT", body: JSON.stringify({ aktivna: !c.aktivna }) });
    onChange();
  }
  async function remove(c: Category) {
    try { await apiFetch(`/api/portal/expense-categories/${c.id}`, { method: "DELETE" }); onChange(); }
    catch (e) { toast({ title: "Nedá sa zmazať", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input placeholder="Nová kategória" value={nazov} onChange={(e) => setNazov(e.target.value)} />
        <Button onClick={add}>Pridať</Button>
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm border-b py-1">
            <span className={c.aktivna ? "" : "text-muted-foreground line-through"}>{c.nazov}</span>
            <span className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => toggle(c)}>{c.aktivna ? "Deaktivovať" : "Aktivovať"}</Button>
              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(c)}>Zmazať</Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
