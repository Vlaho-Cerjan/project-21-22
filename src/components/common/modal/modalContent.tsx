export default function ModalContent({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div {...props} className={`content ${props.className}`}>
      <form>{props.children}</form>
    </div>
  );
}
