import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Button, Container, IconButton, InputAdornment, Snackbar, Stack, Typography } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import * as yup from 'yup'
import { ControlledInput } from '../../components/ControlledInput'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/login'
import { UserContext } from '../../context/UserContext'
import { CartContext } from '../../context/CartContext'
import { ColorButton } from '../../components/ColorButton'

const loginSchema = yup.object({
  email: yup.string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es obligatorio')
    .max(255, 'El correo electrónico no debe tener más de 255 caracteres')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'El correo electrónico no es válido'
    ),
  password: yup.string()
    .required('La contraseña es obligatoria')
}).required()

export function Login () {
  const { setCurrentUser } = useContext(UserContext)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const { cart } = useContext(CartContext)

  const navigate = useNavigate()

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  })

  const onSubmit = data => {
    setIsLoading(true)
    login(data)
      .then((data) => {
        window.localStorage.setItem('currentUser', JSON.stringify(data.user.email))
        window.localStorage.setItem('token', JSON.stringify(data.token))
        setCurrentUser(data.user.email)
        if (data.user.email === 'admin@gmail.com') {
          navigate('/available-movies')
        }

        if (cart.length > 0) {
          navigate('/cart')
        } else {
          navigate('/', { state: { message: 'jelouda' } })
        }
      })
      .catch(error => {
        console.log({ error })
        if (error.response.status === 401) {
          setAlert({
            open: true,
            type: 'error',
            message: 'Contraseña o usuario incorrecto.'
          })
        } else {
          setAlert({
            open: true,
            type: 'error',
            message: 'Ups, hubo un error, intente de nuevo.'
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Container
      sx={{
        height: '70vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          mx: 'auto',
          width: { xs: '90%', sm: '50%', lg: '40%' }
        }}
      >
        <Typography
          component='h1'
          variant='h1'
          sx={{ fontWeight: 'bold', mb: '2rem', textAlign: 'center', fontSize: '40px' }}
        >
          Inicia sesión
        </Typography>

        <ControlledInput
          control={control}
          label='Correo electrónico'
          name='email'
          autoFocus
          sx={{ mb: '1rem' }}
        />

        <ControlledInput
          control={control}
          label='Contraseña'
          name='password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                  type='button'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: '1rem' }}
        />
        <ColorButton
          variant='contained'
          size='large'
          type='submit'
          disabled={isLoading}
          sx={{ textTransform: 'initial', width: '100%', mb: '1rem', fontSize: '1.1rem' }}
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </ColorButton>

        <Button
          variant='text' size='large' type='button'
          sx={{ textDecoration: 'underline', textTransform: 'initial', mx: 'auto', fontSize: '1rem' }}
          component={Link}
          disabled={isLoading}
          to='/recovery'
        >
          Olvidé mi contraseña
        </Button>

        <Stack direction='row' alignItems='center' sx={{ mx: 'auto' }}>
          <Typography>
            ¿No tienes una cuenta?
          </Typography>
          <Button
            variant='text' size='large' type='button'
            sx={{ textTransform: 'initial', fontWeight: '700', fontSize: '1rem' }}
            component={Link}
            disabled={isLoading}
            to='/register'
          >
            Regístrate
          </Button>
        </Stack>
        <Snackbar open={alert?.open}>
          <Alert
            onClose={handleCloseAlert}
            severity={alert?.type}
            sx={{ width: '100%' }}
          >
            {alert?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}
