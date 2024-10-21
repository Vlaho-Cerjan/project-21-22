import Description from '../description/description';
import Title from '../title/title';

export default function ModalHeader({
  title,
  titleComponent,
  description,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title: React.ReactNode | JSX.Element;
  titleComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description?: React.ReactNode;
}) {
  return (
    <div {...props} className={`modalHeader ${props.className}`}>
      <Title component={titleComponent || 'h2'} className="big bold">
        {title}
      </Title>
      {description && <Description className="big">{description}</Description>}
    </div>
  );
}
