function Spinner(): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: '#4481c3',
    }}
    >
      Loading...
    </div>
  );
}

export default Spinner;
