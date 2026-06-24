type SidebarButtonProps = {
  text: string;
};

export default function SidebarButton({ text }: SidebarButtonProps) {
  return (
    <li className="pl-4 py-1 border-l-2 border-white">
      <button className="text-slate-100">{text}</button>
    </li>
  );
}
