import { useNavigate } from 'react-router-dom';
import Logo from '../../../../assets/img/logo.webp';

import { LogoContainer, ThemeSelectRow } from '../Navbar-styles.tsx';
import { useMediaQuery } from '@mui/material';

export const QtubeLogo = () => {
  const navigate = useNavigate();

  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);

  return (
    <ThemeSelectRow>
      <LogoContainer
        onClick={() => {
          navigate('/');
        }}
      >
        <img
          src={Logo}
          style={{
            width: isScreenSmall ? '50px' : 'auto',
            height: '45px',
            padding: '2px',
            marginTop: '5px',
          }}
        />
      </LogoContainer>
    </ThemeSelectRow>
  );
};
