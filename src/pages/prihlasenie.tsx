"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { apiFetch } from "@/lib/portalClient";
import { Turnstile } from "@/components/portal/Turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrihlaseniePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, turnstileToken }),
      });
      const redirect = typeof router.query.redirect === "string" ? router.query.redirect : "/portal";
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prihlásenie zlyhalo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Prihlásenie — E-TAXI Košice Portál</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-3xl mb-2">🚕</div>
            <CardTitle>E-TAXI Košice — Portál</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4" autoComplete="off">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="etaxi-email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Heslo</Label>
                <Input
                  id="password"
                  name="etaxi-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Turnstile onToken={setTurnstileToken} />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Prihlasujem…" : "Prihlásiť sa"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
