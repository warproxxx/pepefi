import {
    Box,
    TextField,
    Typography,
    Button,
    InputAdornment,
    Card,
    CardContent
  } from "@mui/material";
  import { styled, experimental_sx as sx } from '@mui/system';
  import {useState} from 'react'

export const EditTextField = styled(TextField)((props)  => sx({
    // '& .MuiFilledInput-root': {
    //   backgroundColor: 'white'
    // }
}));
  
const inputs = [
    {name:"Vault Name",description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
    {name:"Risk Tolerance",description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
    {name:"Vigorish",description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
    
  ]

export const ManageTab = (props) => {
    const [values, setValues] = useState({
        vaultName: props.valueName,
        riskTolerance: '5',
        vigorish: '3'
      });



    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    return(
        <Box>
            {
                inputs.map((input,index)=>{
                    return(
                        <Card variant="outlined" key={index} sx={{mb:'10px'}}>
                            <CardContent sx={{display:'flex',justifyContent:'space-between',alignItems:'center',py:'16px !important'}}>
                            <Box>
                                <Typography variant="h5" sx={{color: "#5048E5"}}>
                                    {input.name}
                                </Typography>
                                <Typography variant="p" sx={{color: "#161440"}}>
                                    {input.description}
                                </Typography>
                            </Box>

                            <EditTextField
                                label={input.name}
                                variant="outlined"
                                margin="normal"
                                InputProps={input.name!="Vault Name" ? {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                inputMode: 'numeric', 
                                pattern: '[0-9]*' 
                                } : {}}
                                value={Object.values(values)[index]}
                                onChange={handleChange(Object.keys(values)[index])}
                                sx={{
                                    width:'40%'
                                }}
                            />
                            </CardContent>
                        </Card>
                    )
                })
            }
            <Box sx={{display:'flex',justifyContent:'flex-end',marginTop:'25px'}}>
                <Button variant="contained">Save Changes</Button>
            </Box>
        </Box>
    )
}