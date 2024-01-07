export function Flow(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <g opacity="0.1" filter="url(#filter0_b)">
        <circle cx="20" cy="20" r="20" fill="#00EF8B" fillOpacity="0.9" />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.7826 13.9127C23.8221 13.9127 23.0435 14.6913 23.0435 15.6518V17.0433H28.6956V22.3476H22.9565V24.6085C22.9565 28.7867 19.5695 32.1737 15.3913 32.1737C11.2132 32.1737 7.82611 28.7867 7.82611 24.6085C7.82611 20.4304 11.2132 17.0433 15.3913 17.0433H17.8261V15.6518C17.8261 11.8099 20.9406 8.69531 24.7826 8.69531H31.3478V13.9127H24.7826ZM17.8261 17.0866V22.3476H22.9565V17.0866H17.8261ZM15.3913 22.2607C14.0947 22.2607 13.0435 23.3118 13.0435 24.6085C13.0435 25.9052 14.0947 26.9563 15.3913 26.9563C16.688 26.9563 17.7392 25.9052 17.7392 24.6085V22.2607H15.3913Z"
        fill="#03DB80"
      />
      <defs>
        <filter
          id="filter0_b"
          x="-17.6812"
          y="-17.6812"
          width="75.3623"
          height="75.3623"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="8.84058" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
