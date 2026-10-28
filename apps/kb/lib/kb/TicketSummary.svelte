<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, reportsFor, type Problem } from '#lib/kb/problems';

  let { problem, from = 4471, ticket, repo }: { problem: Problem; from?: number; ticket: number; repo: string } = $props();

  const rs = $derived(reportsFor(reports as Report[], from, problem, tenantOf, notes.oneDayMove));
  const alsoOneDay = $derived(problem === 'one-day' ? 0 : rs.filter((r) => notes.oneDayMove.includes(r.id)).length);
  const days = $derived(rs.map((r) => r.receivedAt.slice(0, 10)).sort());
  const count = (key: (r: Report) => string) =>
    Object.entries(rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {}))
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <a href="{repo}/issues/{ticket}">#{ticket}</a> · <code>{problem}</code>: {PROBLEMS[problem]} ·
  <strong>{rs.length}</strong> of the reports merged into #{from}
</p>

<table>
  <tbody>
    <tr><th>reports</th><td>{rs.length}{#if alsoOneDay}&nbsp;<span class="muted">({alsoOneDay} of them read as a one-day move, also counted in their own ticket)</span>{/if}</td></tr>
    <tr><th>tenants</th><td>{count((r) => r.tenant)}</td></tr>
    <tr><th>channels</th><td>{count((r) => r.channel)}</td></tr>
    <tr><th>intake tagged as</th><td>{count((r) => r.meta.intakeTag)}</td></tr>
    <tr><th>seen</th><td>{days[0]} → {days[days.length - 1]}</td></tr>
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .muted { color: var(--muted); font-size: 0.85em; }
  th { width: 10rem; }
</style>
