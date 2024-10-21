import Description from '../description/description';
import Title from '../title/title';

export default function SidebarHeader({
  title,
  description,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div {...props} className={`sidebarHeader ${props.className}`}>
      <Title className="big">{title}</Title>
      {description && <Description className="big">{description}</Description>}
    </div>
  );
}
