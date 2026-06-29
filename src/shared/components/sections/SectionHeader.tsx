export default function SectionHeader({ title }: { title: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
    </header>
  );
}
