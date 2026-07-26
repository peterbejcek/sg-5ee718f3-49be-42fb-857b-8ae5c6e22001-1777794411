"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, ROLE_LABELS, type Role } from "@/lib/portalClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: number; email: string; meno: string; priezvisko: string;
  telefon: string | null; volaciZnak: string | null; aktivny: boolean;
  mustSetPassword: boolean; registracnyPoplatokUhradeny: boolean;
  roles: Role[];
};

const ALL_ROLES: Role[] = ["VODIC", "DISPECER", "MAJITEL"];
const emptyForm = {
  email: "", meno: "", priezvisko: "", telefon: "", volaciZnak: "",
  roles: ["VODIC"] as Role[], registracnyPoplatokUhradeny: false, sendInvite: true,
};

export default function VodiciPage() {
  const { toast } = useToast();
  const [list, setList] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  function load() {
    apiFetch<{ users: User[] }>("/api/portal/users").then((d) => setList(d.users));
  }
  useEffect(load, []);

  function openNew() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openEdit(u: User) {
    setEditing(u);
    setForm({
      email: u.email, meno: u.meno, priezvisko: u.priezvisko, telefon: u.telefon || "",
      volaciZnak: u.volaciZnak || "", roles: u.roles, registracnyPoplatokUhradeny: u.registracnyPoplatokUhradeny, sendInvite: false,
    });
    setOpen(true);
  }

  function toggleRole(r: Role) {
    setForm((f) => ({ ...f, roles: f.roles.includes(r) ? f.roles.filter((x) => x !== r) : [...f.roles, r] }));
  }

  async function save() {
    if (form.roles.length === 0) { toast({ title: "Vyberte aspoň jednu rolu", variant: "destructive" }); return; }
    try {
      if (editing) {
        await apiFetch(`/api/portal/users/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            meno: form.meno, priezvisko: form.priezvisko, telefon: form.telefon || null,
            volaciZnak: form.volaciZnak || null, roles: form.roles,
            registracnyPoplatokUhradeny: form.registracnyPoplatokUhradeny,
          }),
        });
      } else {
        const r = await apiFetch<{ inviteLink?: string }>("/api/portal/users", { method: "POST", body: JSON.stringify(form) });
        if (r.inviteLink) {
          toast({ title: "Používateľ vytvorený", description: `SMTP nenastavené — odkaz: ${r.inviteLink}` });
        }
      }
      setOpen(false); load();
      toast({ title: "Uložené" });
    } catch (e) {
      toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

  async function toggleReg(u: User) {
    await apiFetch(`/api/portal/users/${u.id}`, { method: "PUT", body: JSON.stringify({ registracnyPoplatokUhradeny: !u.registracnyPoplatokUhradeny }) });
    load();
  }
  async function resend(u: User) {
    const r = await apiFetch<{ inviteLink?: string }>(`/api/portal/users/${u.id}`, { method: "PUT", body: JSON.stringify({ resendInvite: true }) });
    toast({ title: "Pozvánka odoslaná", description: r.inviteLink ? `Odkaz: ${r.inviteLink}` : undefined });
  }
  async function remove(u: User) {
    if (!confirm(`Zmazať používateľa ${u.meno} ${u.priezvisko}?`)) return;
    try { await apiFetch(`/api/portal/users/${u.id}`, { method: "DELETE" }); load(); }
    catch (e) { toast({ title: "Chyba", description: e instanceof Error ? e.message : "", variant: "destructive" }); }
  }

  return (
    <PortalLayout title="Vodiči a personál">
      <Head><title>Vodiči — E-TAXI Portál</title></Head>

      <div className="mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}>+ Pridať vodiča / personál</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Upraviť používateľa" : "Nový používateľ"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Meno</Label><Input value={form.meno} onChange={(e) => setForm({ ...form, meno: e.target.value })} /></div>
              <div><Label>Priezvisko</Label><Input value={form.priezvisko} onChange={(e) => setForm({ ...form, priezvisko: e.target.value })} /></div>
              <div><Label>Volací znak</Label><Input placeholder="napr. E10" value={form.volaciZnak} onChange={(e) => setForm({ ...form, volaciZnak: e.target.value })} /></div>
              <div><Label>Telefón</Label><Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} /></div>
              <div className="col-span-2"><Label>E-mail</Label><Input type="email" disabled={!!editing} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="col-span-2">
                <Label>Roly</Label>
                <div className="flex gap-4 mt-1">
                  {ALL_ROLES.map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={form.roles.includes(r)} onCheckedChange={() => toggleRole(r)} />
                      {ROLE_LABELS[r]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.registracnyPoplatokUhradeny} onCheckedChange={(v) => setForm({ ...form, registracnyPoplatokUhradeny: !!v })} />
                  Registračný poplatok (30 €) uhradený
                </label>
              </div>
              {!editing && (
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.sendInvite} onCheckedChange={(v) => setForm({ ...form, sendInvite: !!v })} />
                    Poslať pozvánku e-mailom (nastavenie hesla)
                  </label>
                </div>
              )}
            </div>
            <DialogFooter><Button onClick={save}>Uložiť</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meno</TableHead><TableHead>Znak</TableHead><TableHead>Kontakt</TableHead>
              <TableHead>Roly</TableHead><TableHead>Reg. poplatok</TableHead><TableHead>Stav</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.priezvisko} {u.meno}</TableCell>
                <TableCell>{u.volaciZnak || "—"}</TableCell>
                <TableCell className="text-sm"><div>{u.email}</div><div className="text-muted-foreground">{u.telefon}</div></TableCell>
                <TableCell>{u.roles.map((r) => <Badge key={r} variant="outline" className="mr-1">{ROLE_LABELS[r]}</Badge>)}</TableCell>
                <TableCell>
                  <button onClick={() => toggleReg(u)}>
                    {u.registracnyPoplatokUhradeny
                      ? <Badge className="bg-green-600">Uhradený</Badge>
                      : <Badge variant="destructive">Neuhradený</Badge>}
                  </button>
                </TableCell>
                <TableCell>
                  {u.mustSetPassword ? <Badge variant="secondary">Čaká na heslo</Badge> : u.aktivny ? <Badge className="bg-green-600">Aktívny</Badge> : <Badge variant="secondary">Neaktívny</Badge>}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Upraviť</Button>
                  <Button size="sm" variant="ghost" onClick={() => resend(u)}>Pozvánka</Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => remove(u)}>Zmazať</Button>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Zatiaľ žiadni používatelia.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  );
}
