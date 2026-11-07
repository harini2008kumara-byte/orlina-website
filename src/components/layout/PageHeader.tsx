interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-normal text-muted">{description}</p>
    </header>
  );
}
