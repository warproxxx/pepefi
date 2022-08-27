import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {AddVaultPopupQuestionTextField} from './AddVaultPopup'
import { Typography, Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import {ACCEPTED_COLLECTIONS} from 'src/config'

import { tooltipDelay } from 'src/constants/tooltip';

export default function ComboBox(props) {
const selectedValue = props.value;
const SetSelectedValue = props.setSelectedCollectionAddressAndName;
let inputRef;
const pictureWidthAndHeight = '45px';
  return (
    <Tooltip title={"Ethereum contract address for the collection, currently we only support the collections listed below"} 
    arrow 
    disableFocusListener 
    disableTouchListener 
    enterDelay={tooltipDelay}
    placement="top">
        <Autocomplete
        id="combo-box-demo"
        options={ACCEPTED_COLLECTIONS}
        freeSolo
        disableClearable
        openOnFocus
        onOpen={()=>{
            SetSelectedValue("");
        }}
        getOptionLabel={option => option.name}
        filterOptions={(options,state) => {
            const tmp_options_arr = []
            options.map((option,index)=>{
                if(option.name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.address.toLowerCase().includes(state.inputValue.toLowerCase()))
                    tmp_options_arr.push(option)
            })

            return tmp_options_arr

        }}
        onInputChange={(event) => {
            if(event?.target?.value == null){
                SetSelectedValue("");
            }
            SetSelectedValue(event?.target?.value);
        }}
        inputValue={selectedValue}
        renderOption={(props,option,state)=>{
            return(
                <li key={option.name}>
                    <Box sx={{display:'flex',borderBottom:'1px solid #2D3748',paddingX:'5px',paddingY:'10px',cursor:'pointer','&:hover':{
                        backgroundColor:'#ffffff10'
                    }}}
                    onClick={()=>{
                        SetSelectedValue(option.address,option.name);
                        inputRef.blur();
                    }}
                    >
                    <Box sx={{width:'20%',display:'flex',justifyContent:'center',alignItems:'flex-start',alignContent:'center'}}>
                        <Box sx={{borderRadius:'10px',overflow:'hidden',width:pictureWidthAndHeight,height:pictureWidthAndHeight,margin:'auto'}}>
                            <Image src={option.imgSrc} height={pictureWidthAndHeight} width={pictureWidthAndHeight}></Image>
                        </Box>

                    </Box>
                    <Box sx={{width:'80%',display:'flex',justifyContent:'center',alignItems:'flex-start',flexDirection:'column',alignContent:'center'}}>
                        <Box>
                            <Typography sx={{color:'white'}}>
                                {option.name}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{color:'white',fontSize:'10px'}}>
                                {option.address}
                            </Typography>
                        </Box>
                    </Box>
                    </Box>
                </li>

            )

        }}
        renderInput={params => (
            <AddVaultPopupQuestionTextField   
            {...params}              
            label={"collection address"}
            variant="filled"
            margin="normal"
            fullWidth
            placeholder="0x000...000"
            inputRef={input => {
                inputRef = input;
            }}
            inputProps={{
                ...params.inputProps,
                onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                        e.stopPropagation();
                    }
                },
            }}
            />
        )}
        />
    </Tooltip>

  );
}