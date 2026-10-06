import '../styles/HeaderPage.css';

function PageHeader({
  image,
  eyebrow,
  title,
  subtitle,
  className = ''
}) {
  return (
    <header
      className={`page-header ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="page-header-content">

        {eyebrow && (
          <span className="page-header-eyebrow">
            {eyebrow}
          </span>
        )}

        <h1 className="page-header-title">
          {title}
        </h1>

        {subtitle && (
          <p className="page-header-subtitle">
            {subtitle}
          </p>
        )}

      </div>
    </header>
  );
}

export default PageHeader;