import {assertNever} from '@age-online/lib-common';
import {
    IEmulation,
    InvalidRomFileError,
    NoZippedRomFoundError,
    RomFileLoadingError,
    WasmFetchError,
    WasmInitError,
} from '@age-online/lib-emulator';
import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import {SettingsOutlined} from '@material-ui/icons';
import {WithI18nProps} from '@shopify/react-i18n';
import React, {Component, ReactNode} from 'react';
import {EmulatorState, withI18nBundle} from '../../components';
import i18nBundle from './emulator-state.i18n.json';


export interface IStateNoEmulator {
    readonly state: EmulatorState.NO_EMULATOR;
}

export interface IStateEmulatorLoading {
    readonly state: EmulatorState.EMULATOR_LOADING;
}

export interface IStateEmulatorError {
    readonly state: EmulatorState.EMULATOR_ERROR;
    readonly error: unknown;
}

export interface IStateEmulatorRunning {
    readonly state: EmulatorState.EMULATOR_READY;
    readonly emulation: IEmulation;
}

export type TEmulatorState =
    | IStateNoEmulator
    | IStateEmulatorLoading
    | IStateEmulatorError
    | IStateEmulatorRunning;


const styles = createStyles({
    '@keyframes animateIcon': {
        from: {transform: 'rotate(0deg)'},
        to: {transform: 'rotate(360deg)'},
    },
    loading: {
        opacity: 0.3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    loadingIcon: {
        fontSize: '150px',
        animation: '2s ease-in-out 0s infinite $animateIcon',
    },
    invalidRomReason: {
        opacity: 0.5,
    },
});

export interface IEmulatorStateDetailsProps {
    readonly emulatorState: TEmulatorState;

    onConfirmError?(): void;
}

type TEmulatorStateDetailsProps = IEmulatorStateDetailsProps & WithStyles & WithI18nProps;

class ComposedEmulatorStateDetails extends Component<TEmulatorStateDetailsProps> {

    render(): ReactNode {
        const {emulatorState, onConfirmError, classes, i18n} = this.props;
        switch (emulatorState.state) {

            case EmulatorState.NO_EMULATOR:
            case EmulatorState.EMULATOR_READY:
                return <></>;

            case EmulatorState.EMULATOR_LOADING:
                return (
                    <div className={classes.loading}>
                        <SettingsOutlined className={classes.loadingIcon}/>
                        <span>{i18n.translate('loading')}</span>
                    </div>
                );

            case EmulatorState.EMULATOR_ERROR:
                return (
                    <Dialog disableBackdropClick={true}
                            open={true}
                            onClose={() => onConfirmError?.()}>

                        <DialogContent>
                            <DialogContentText component="div">
                                <p>{i18n.translate(errorTextId(emulatorState.error))}</p>
                                {emulatorState.error instanceof Error && (
                                    <Typography className={classes.invalidRomReason}
                                                component="p"
                                                variant="caption">
                                        ({emulatorState.error.message})
                                    </Typography>
                                )}
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => onConfirmError?.()}>{i18n.translate('error:confirm')}</Button>
                        </DialogActions>
                    </Dialog>
                );

            default:
                return assertNever(emulatorState);
        }
    }
}

export const EmulatorStateDetails = withStyles(styles)(
    withI18nBundle('emulator-state', i18nBundle)(
        ComposedEmulatorStateDetails,
    ),
);


function errorTextId(error: unknown): string {
    if (error instanceof WasmFetchError) {
        return 'error-text:wasm-fetch';
    }
    if (error instanceof WasmInitError) {
        return 'error-text:wasm-init';
    }
    if (error instanceof RomFileLoadingError) {
        return 'error-text:rom-file-loading';
    }
    if (error instanceof NoZippedRomFoundError) {
        return 'error-text:no-zipped-rom-found';
    }
    if (error instanceof InvalidRomFileError) {
        return 'error-text:invalid-rom-file';
    }
    return 'error-text';
}
