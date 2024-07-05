import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton, SxProps } from '@mui/material';
import { styled, useTheme, Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';

interface CustomTextBoxProps {
    icon?: boolean;
    iconType?: 'email' | 'password' | 'username' | 'search';
    type?: 'text' | 'password';
    value: string;
    error?: boolean;
    formErrors?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    customSx?: SxProps<Theme>;
    [key: string]: any; // To allow any additional props,
    label?:string
}

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: "black",
    backgroundColor: "transparent",
    '& .Mui-focused fieldset': {
        border: `1px solid black !important`,
    },
    '& fieldset': {
        border: `1px solid black`,
    },
    '& .MuiInputBase-root': {
        borderRadius: '8px',
    },
    '& input::placeholder': {
        fontStyle: 'normal',
        fontWeight: 400,
        opacity: 1,
    },
    '& .MuiInputBase-input': {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '18px',
        opacity: 1,
    },
    '& .input': {
        fontSize: '18px',
    },
}));

const CustomTextBox: React.FC<CustomTextBoxProps> = ({
    icon = false,
    iconType,
    type = 'text',
    value,
    error,
    formErrors,
    onChange,
    customSx,
    label,
    ...rest
}) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const getIcon = (iconType: string | undefined): React.ReactNode | null => {
        switch (iconType) {
            case 'email':
                return <MailIcon />;
            case 'password':
                return <KeyTwoToneIcon />;
            case 'username':
                return <AccountCircleIcon />;
            case 'search':
                return <SearchIcon />;
            default:
                return null;
        }
    };

    return (
        <StyledTextField
            type={showPassword ? 'text' : type}
            value={value}
            onChange={onChange}
            fullWidth
            required
            label={label}
            sx={customSx}
            {...rest}
            InputProps={{
                startAdornment: icon ? (
                    <InputAdornment position='start'>
                        {getIcon(iconType)}
                    </InputAdornment>
                ) : null,
                endAdornment: iconType === 'password' ? (
                    <InputAdornment position='end'>
                        <IconButton onClick={togglePasswordVisibility} edge='end'>
                            {/* {showPassword ? (
                                <img src={Images.VisibilityPassword_Icon} className='image-box' alt='Visibility Icon' />
                            ) : (
                                <img src={Images.VisibilityOffPassword_Icon} className='image-box' alt='Visibility Off Icon' />
                            )} */}
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
        />
    );
};

export default CustomTextBox;
