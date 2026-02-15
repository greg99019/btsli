import { apiGet } from '@/lib/api';

type Service = {
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  unitLabel: string;
  focusAreas: string[];
};

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const s = await apiGet<Service>(`/services/${params.slug}`);

  return (
    <div>
      <h1>{s.name}</h1>
      <p>{s.description}</p>
      <div><b>Price:</b> ${s.priceMin}–${s.priceMax} ({s.unitLabel})</div>
      <div><b>Duration:</b> {s.durationMin} minutes</div>

      {s.focusAreas?.length ? (
        <>
          <h3>Focus areas</h3>
          <ul>{s.focusAreas.map((f) => <li key={f}>{f}</li>)}</ul>
        </>
      ) : null}

      <a href="/schedule">Schedule your appointment</a>
    </div>
  );
}
