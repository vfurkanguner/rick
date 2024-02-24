type Props = {
  text: string;
  searchTerm: string;
};

export default function HighligtedText({ text, searchTerm }: Props) {
  if (!searchTerm.trim()) {
    return <span className="combobox-search-item-heading">{text}</span>;
  }

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <span className="combobox-search-item-heading">
      {parts.map((part, index) =>
        regex.test(part) ? (
          <strong style={{ fontWeight: 800 }} key={index}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
}
