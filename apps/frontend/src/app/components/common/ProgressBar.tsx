export const ProgressBar = () => {
  return (
    <div className="progress-bar">
      <div aria-hidden>
        <svg
          width="100%"
          height="4"
          focusable="false"
          className="progress-bar-background progress-bar-element"
        >
          <defs>
            <pattern
              x="4"
              y="0"
              width="8"
              height="4"
              patternUnits="userSpaceOnUse"
              id="mat-progress-bar-1"
            >
              <circle cx="2" cy="2" r="2"></circle>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url('/components/progress-bar/overview#mat-progress-bar-1')"
          ></rect>
        </svg>
        <div className="progress-bar-buffer"></div>
      </div>
      <div className="progress-bar-primary"></div>
      <div className="progress-bar-secondary"></div>
    </div>
  );
};
