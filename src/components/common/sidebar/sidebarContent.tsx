export default function SidebarContent({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div {...props} className={`sidebarContentContainer ${props.className}`}>
      {props.children}
    </div>
  );
}
