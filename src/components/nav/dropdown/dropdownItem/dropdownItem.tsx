import MemoAddNetwork from '@/src/icons/add-network';
import MemoAddSubNetwork from '@/src/icons/add-sub-network';
import MemoDropDownRight from '@/src/icons/drop-down-right';

export default function DropdownItem({
  title,
  level,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {title: string; level?: number}) {
  return (
    <div className="dropdownItem">
      <button
        type="button"
        {...props}
        className={`navSubItem navSubButton${
          props.className ? ` ${props.className}` : ''
        }${level ? ` level${level}` : ''}`}
      >
        <MemoDropDownRight className="arrow" />
        <span>{title}</span>
      </button>
      <div
        tabIndex={0}
        role="button"
        aria-label={`Add New Item To This ${title} Menu`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // console.log('clicked');
          }
        }}
        onClick={(e) => {
          e.preventDefault();
        }}
        className="addNetworkButton"
      >
        {level && level > 1 ? <MemoAddSubNetwork /> : <MemoAddNetwork />}
      </div>
    </div>
  );
}

export function DropdownItemButton({
  title,
  level,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {title: string; level?: number}) {
  return (
    <div className="dropdownItem">
      <button
        type="button"
        {...props}
        className={`navSubItem navSubButton${
          props.className ? ` ${props.className}` : ''
        }${level ? ` level${level}` : ''}`}
      >
        <span>{title}</span>
      </button>
      {/*
      <div
        tabIndex={0}
        role="button"
        aria-label={`Add New Item To This ${{ title }} Menu`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            console.log('clicked');
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          console.log('clicked');
        }}
        className="addNetworkButton"
      >
        {level && level > 1 ? <MemoAddSubNetwork /> : <MemoAddNetwork />}
      </div>
      */}
    </div>
  );
}
