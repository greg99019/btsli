import { apiGet } from '@/lib/api';

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  unitLabel: string;
  focusAreas: string[];
};

export default async function ServicesPage() {
  const services = await apiGet<Service[]>('/services');

  return (
    <div>
      <h1>Our Services</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {services.map(s => (
          <div key={s.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <h3>{s.name}</h3>
            <div><b>Price:</b> ${s.priceMin}–${s.priceMax} ({s.unitLabel})</div>
            <div><b>Duration:</b> {s.durationMin} minutes</div>
            <p>{s.description}</p>
            <a href={`/services/${s.slug}`}>Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}
