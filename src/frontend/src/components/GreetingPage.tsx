import  { useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import logo from '../assets/logo.png';

const AnimatedLogo = styled('img')(() => ({
  width: '100%',
  height: 'auto',
  marginBottom: '20px',
  opacity: 0,
  animation: 'fadeIn 1s ease-in-out forwards',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

function GreetingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box sx={styles.container}>
      <AnimatedLogo src={logo} alt="Matcha Logo" style={{ opacity: isVisible ? 1 : 0 }} />
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default GreetingPage;
