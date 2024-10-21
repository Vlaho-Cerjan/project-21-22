export default function Skeleton({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      {...props}
      className={`skeleton${props.className ? ` ${props.className}` : ''}`}
    >
      <img
        fetchPriority="high"
        src="/assets/skeleton/image-280.jpg"
        srcSet="
          /assets/skeleton/image-280.jpg 280w,
          /assets/skeleton/image-480.jpg 480w,
          /assets/skeleton/image-560.jpg 560w,
          /assets/skeleton/image-840.jpg 840w,
          /assets/skeleton/image-960.jpg 960w,
          /assets/skeleton/image-1440.jpg 1440w"
        sizes="(min-width: 768px) 480px, 87.5vw"
        alt="loading placeholder"
      />
    </div>
  );
}
