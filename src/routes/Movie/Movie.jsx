import React, { useContext, useState, useEffect, version } from 'react'
import { orange } from '@mui/material/colors';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MovieContext } from '../../context/MovieContext'
import { CartContext } from '../../context/CartContext'
import { useForm, Controller } from 'react-hook-form'
import { CartIcon, CancelIcon } from '../../components/Icons'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'
import Autocomplete from '@mui/joy/Autocomplete'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import { CardMedia, Select, Typography } from '@mui/material'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
import FormLabel from '@mui/joy/FormLabel'
import Radio, { radioClasses } from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import { formatLongDate, formatTime } from '../../utils'
import { ColorButton } from '../../components/ColorButton'

const Movie = () => {
  const { id } = useParams()
  const { listings } = useContext(MovieContext)
  const { cart, setCart } = useContext(CartContext)
  const [movies] = listings.filter((item) => item.id === Number(id))
  const { cinemaShows } = movies
  console.log('cineSowns:', cinemaShows)
  const navigate = useNavigate()

  // Lista de salas diponibles por pelicula   const uniqueRooms=['Estelar','Solaz']
  const [roomSelected, setRoomSelected] = useState('Estelar')
  console.log('capturadoRoom', roomSelected)
  // filtra las fechas
  const [fechas, setFechas] = useState([])
  const uniqueFechas = [...new Set(fechas)]
  // filtra las horas
  const [horas, setHoras] = useState([])
  // guarda lo capturado fecha y hora
  const [fechaSelected, setFechasSelected] = useState('a')
  console.log('capturadoFecha', fechaSelected)

  const [horaSelected, setHoraSelected] = useState('a')
  console.log('capturadoHora', horaSelected)

  const handleSelected = (event, value) => {
    setRoomSelected(value)
    setFechasSelected('')
    setFechas(movies.cinemaShows.filter((item) => item.room.name === value).map((item) => item.date))
    setHoras([])
  }
  useEffect(() => {
    handleSelected(null,roomSelected)
  }, [roomSelected])
  


  const handleChangeFecha = (event, value) => {
    setFechasSelected(event.target.value)
    setHoras(movies.cinemaShows.filter((item) => item.date === event.target.value && item.room.name === roomSelected).map((item) => ({hour: item.hour, minutes: item.minutes})))
  }
  const handleChangeHora = (event) => {
    setHoraSelected(event.target.value)
  }

  /* const[available, setAvailable]=useState(' ') */
  const [available] = movies.cinemaShows.filter((item) => item.hour == horaSelected && item.date == fechaSelected).map(item => item.capacityAvailable)
  console.log('cantidadDisponible', available)
  // precio por rooms
  const [priceOn] = movies.cinemaShows.filter((item) => item.room.name === roomSelected).map((item) => item.price)
  // cantidad de boletos
  const [quantity, setQuantity] = useState('')
  const quantityAsNumber = Number(quantity)
  console.log('cantidad', quantityAsNumber)
  // control de cantidad de boletos segun disponibilidad

  // precio total
  const totalPrice = quantityAsNumber == 0 ? priceOn : priceOn * quantityAsNumber
  // id de cinemaShow
  const [cinemaShowId] = movies.cinemaShows.filter((item) => item.date == fechaSelected && item.room.name == roomSelected && item.hour == horaSelected).map(item => item.id)
  console.log('id', cinemaShowId)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data, event) => {
    try {
      console.log('datoStorage', data)

      const moviesCart = {
        id: crypto.randomUUID(),
        cinemaShowId,
        image: movies.image.url,
        room: roomSelected,
        name: movies.title,
        date: data.date,
        hour: data.hour,
        quantity: data.quantity,
        price: priceOn,
        total: totalPrice
      }
      window.localStorage.setItem('addCart', JSON.stringify([...cart, moviesCart]))
      setCart([...cart, moviesCart])

      navigate('/cart')
      event.preventDefault()
    } catch (error) {
      console.log('lag', error)
    }
  }

  const onError = (error) => {
    console.log('lagg', error, errors)
  }
  return (
    <>
      <Sheet variant='outlined' color='neutral' sx={{ p: 1, textAlign: 'center', backgroundColor: '#CCCCCC' }}>
        <h1>{movies.title}</h1>
      </Sheet>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2} sx={{ flexGrow: 1, padding: '2rem', height: '100%' }} justifyContent='center'>
          <Grid item='true' xs={12} sm={6}>
            <Grid item xs={12} sx={{ height: { sm: '25rem' } }}>
              <CardMedia component='iframe' src={movies.trailerUrl.replace('.be', 'be.com/embed')} allow='autoPlay' sx={{ display: { xs: 'none', sm: 'initial' }, height: '100%' }} />
            </Grid>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item='true' xs={6}>
                <Box
                  component='img'
                  src={movies.image.url}
                  loading='lazy'
                  sx={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    paddingTop: '20px'
                  }}
                />
              </Grid>
              <Grid item='true' xs={6}>
                <Tabs aria-label='Basic tabs' defaultValue={0} sx={{ width: '20em', paddingTop: '20px' }}>
                  <TabList>
                    <Tab>Sinopsis</Tab>
                    <Tab>Datos técnicos</Tab>
                  </TabList>
                  <TabPanel value={0}>
                    {movies.description}
                  </TabPanel>
                  <TabPanel value={1}>
                    <b>Director:</b> {movies.director}
                    <br />
                    <b>Género:</b> {movies.gender}
                  </TabPanel>
                </Tabs>
              </Grid>
            </Grid>
          </Grid>
          <Grid item='true' sm={12} md={6}>
            <Typography variant='h6'>
              ELEGIR PELÍCULA POR:
            </Typography>
            {/* {console.log(movies.cinemaShows[0].room.name)} */}
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <Grid item xs={12}>
                <Typography level='body-xs' gutterBottom='true' sx={{ width: '100%' }}>Animación</Typography>
                <Autocomplete
                  placeholder='Seleccione la animación'
                  style={{ width: 300, marginBottom: '6%' }}
                  value={roomSelected}
                  options={uniqueRooms}
                  onChange={handleSelected}
                  renderInput={(params) => <TextField {...params} defaultValue='Estelar' variant='outlined' />}
                />

                {/* <p>{errors.animation?.message}</p> */}
                <Typography level='body-xs' gutterBottom='true' sx={{ width: '100%', margin: '10px 0px' }}>Fechas diponibles</Typography>
                <Paper sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  paddingBottom: '5%',
                  paddingTop: '2%',
                  marginBottom: '6%'
                }}
                >
                  <RadioGroup
                    overlay
                    sx={{
                      flexDirection: 'row',
                      gap: 2,
                      [`& .${radioClasses.checked}`]: {
                        [`& .${radioClasses.action}`]: {
                          inset: -1,
                          border: '3px solid',
                          borderColor: 'primary.500'
                        }
                      },
                      [`& .${radioClasses.radio}`]: {
                        display: 'contents',
                        '& > svg': {
                          zIndex: 2,
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          bgcolor: 'background.surface',
                          borderRadius: '50%'
                        }
                      }
                    }}
                    value={fechaSelected}
                    onChange={handleChangeFecha}
                  >
                    <p style={{ color: 'red' }}>{errors.date?.message}</p>

                    {uniqueFechas.map((value) => (
                      <Sheet
                        key={value}
                        variant='outlined'
                        sx={{
                          borderRadius: 'md',
                          boxShadow: 'sm',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          minWidth: 120
                        }}
                      >
                        <Radio
                          value={value}
                          checkedIcon={<CheckCircleRoundedIcon />}
                          {...register('date', { required: 'Debe seleccionar una fecha' })}
                        />
                        <FormLabel htmlFor={value}>{formatLongDate(value)}</FormLabel>
                      </Sheet>

                    ))}
                  </RadioGroup>
                </Paper>

                <Typography level='body-xs' gutterBottom='true' sx={{ width: '100%', margin: '10px 0px' }}>Horas diponibles</Typography>
                <Paper sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  paddingBottom: '5%',
                  paddingTop: '2%',
                  marginBottom: '5%'
                }}
                >
                  <RadioGroup
                    overlay
                    sx={{
                      flexDirection: 'row',
                      gap: 2,
                      [`& .${radioClasses.checked}`]: {
                        [`& .${radioClasses.action}`]: {
                          inset: -1,
                          border: '3px solid',
                          borderColor: 'primary.500'
                        }
                      },
                      [`& .${radioClasses.radio}`]: {
                        display: 'contents',
                        '& > svg': {
                          zIndex: 2,
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          bgcolor: 'background.surface',
                          borderRadius: '50%'
                        }
                      }
                    }}
                    onChange={handleChangeHora}
                  >
                    <p style={{ color: 'red' }}>{errors.hour?.message}</p>
                    {horas.map((value,index) => (
                      <Sheet
                        key={index}
                        variant='outlined'
                        sx={{
                          borderRadius: 'md',
                          boxShadow: 'sm',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 2,
                          minWidth: 120
                        }}
                      >
                        <Radio
                          value={value.hour}
                          checkedIcon={<CheckCircleRoundedIcon />}
                          {...register('hour', { required: 'Debe seleccionar una hora' })}
                        />
                        <FormLabel htmlFor={value.hour}> {formatTime(value.hour, value.minutes)}</FormLabel>
                      </Sheet>
                    ))}
                  </RadioGroup>
                </Paper>

                <Typography level='body-xs' gutterBottom='true' sx={{ width: '100%', marginBottom: '5%' }}>Cantidad disponible: {available}</Typography>

                <Typography level='body-xs' gutterBottom='true' sx={{ width: '100%' }}>Cantidad</Typography>
                <Input
                  type='number'
                  placeholder='Ingrese la cantidad de boletos'
                  value={quantity >= 1 && quantity <= available ? quantity : ''}
                  name='quantity'
                  onInput={e => { setQuantity(e.target.value) }}
                  sx={{ width: 300 }}
                  {...register('quantity', { required: 'Debe ingresar una cantidad' })}
                />
                <p style={{ color: 'red' }}>{errors.quantity?.message}</p>

              </Grid>

              <Typography level='body-xs' variant='h6' sx={{ marginBottom: '5%', width: '100%', textAlign: 'end', marginRight: '2em' }}>Subtotal: $ {totalPrice}</Typography>
              
              <Grid container spacing={2} sx={{display:'flex', justifyContent:'space-between'}}>

                <Grid item='true'>
                  <Tooltip>
                    <Link className='btn-back' to='/'>
                      <ColorButton
                        size='md' variant='neutral' aria-label='Explore Bahamas Islands'
                        sx={{ ml: 'auto', width: '210px', alignSelf: 'center', fontWeight: 600 }}
                        /* startIcon={<CancelIcon />} */
                      >
                        Volver
                      </ColorButton>
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item='true'>
                  <Tooltip >
                    <ColorButton
                      type='submit' size='md' variant='neutral' aria-label='Explore Bahamas Islands'
                      sx={{ ml: 'auto', width: '210px', alignSelf: 'flex-end', fontWeight: 600 }}
                      startIcon={<CartIcon /* stroke='#FFF' */ height={25} />}
                    >
                      Añadir al carrito
                    </ColorButton>
                  </Tooltip>
                </Grid>

              </Grid>

            </form>
          </Grid>

        </Grid>

      </Box>
    </>
  )
}

export default Movie

const uniqueRooms = [
  'Estelar',
  'Solaz'
]
const animation = [
  { label: '3D' },
  { label: '2D' }

]
