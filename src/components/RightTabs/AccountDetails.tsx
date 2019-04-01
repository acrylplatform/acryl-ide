import React from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core/styles';
import { libs } from '@waves/waves-transactions';
import TextField from '@material-ui/core/TextField/TextField';
import { copyToClipboard } from '@utils/copyToClipboard';

const {privateKey, publicKey, address} = libs.crypto;

const styles = (theme: Theme): any => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        fontWeight: 'bold',
        flexShrink: 0,
    },
    fieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    field: {
        width: '80%',
        overflowX: 'hidden',
        textOverflow: 'ellipsis'
    }
});

interface IAccountDetailsProps {
    classes: any
    seed: string
    chainId: string
    onSeedChange: (seed: string) => void
    notifyUser: (msg: string) => any
}


const accountDetails = ({classes, seed, chainId, onSeedChange, notifyUser}: IAccountDetailsProps) => {
    const config = {
        'Address': address(seed, chainId),
        'Public Key': publicKey(seed),
        'Private Key': privateKey(seed),
        'Seed': seed

    };

    return <div className={classes.root}>
        {Object.entries(config).map(([title, value], index) => (
            <React.Fragment key={index}>
                <Typography className={classes.heading}>{title}</Typography>
                <div className={classes.fieldContainer}>
                    {title === 'Seed' ?
                        <TextField
                            rowsMax={4}
                            className={classes.field}
                            fullWidth
                            multiline
                            onChange={(e) => onSeedChange(e.target.value)}
                            value={value}
                        />
                        :
                        <Typography className={classes.field}>{value}</Typography>
                    }
                    <IconButton onClick={() => {
                        copyToClipboard(value);
                        notifyUser(`${title} copied!`);
                    }}>
                        <FileCopyOutlined/>
                    </IconButton>
                </div>
                <br/>
            </React.Fragment>
        ))}
    </div>;
};

export default withStyles(styles)(accountDetails);
