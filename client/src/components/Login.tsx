import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { User } from '../types/users'
import { v4 } from 'uuid';

interface ILogin {
  onUserSubmit: (user: { id: string, name: string }) => void;
}

const Login: React.FC<ILogin> = ({
  onUserSubmit
}) => {
  const [user, setUser] = React.useState<User>({} as User);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setUser({
      id: v4(),
      name: ''
    })
  }, []);

  const onLogin = () => {
    setIsSubmitted(true);
    onUserSubmit(user);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
    setUser((prev) => ({
      ...prev,
      [id]: event.target.value
    }))
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="id"
            label="Your user id"
            name="id"
            autoComplete="id"
            autoFocus
            value={user.id}
            disabled
            onChange={(e) => onChange(e, 'id')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter your name"
            name="name"
            autoComplete="name"
            autoFocus
            value={user.name}
            onChange={(e) => onChange(e, 'name')}
            error={isSubmitted && !user.name}
          />
          <Grid container spacing={2}>
            <Grid item xs>
              <Button
                type="button"
                onClick={onLogin}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login