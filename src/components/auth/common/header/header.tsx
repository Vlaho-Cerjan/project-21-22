import MemoProjectLogoBig from '@/src/icons/project-logo-big';
import MemoProfile from '@/src/icons/profile';

export default function Header({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <header className="headerContainer">
      <div data-testid="logoIcon" className="logo">
        <MemoProjectLogoBig aria-label="Project logo" />
      </div>
      <div className="signInContainer">
        <button
          data-testid="signInButton"
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <span>Sign In</span>
          <div data-testid="signInIcon" className="signInIcon">
            <MemoProfile aria-label="Sign in icon" />
          </div>
        </button>
      </div>
    </header>
  );
}
