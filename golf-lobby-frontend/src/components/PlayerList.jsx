export default function PlayerList({ players }) {
  return (
    <ul>
      {players.map(p => (
        <li className="text-wrapper" key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}