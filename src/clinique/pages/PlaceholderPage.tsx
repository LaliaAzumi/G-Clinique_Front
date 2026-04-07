type Props = {
  title: string;
};

export default function PlaceholderPage({ title }: Props) {
  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 4,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280" }}>Tableau de bord › {title}</p>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: "60px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: 14,
        }}
      >
        Page {title} — à implémenter
      </div>
    </div>
  );
}
