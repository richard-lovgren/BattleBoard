export interface RadioButtonInput {
    value: string;
    label: string;
    defaultChecked?: boolean;
}

export default interface RadioButtonProps {
    main_label: string;
    name: string;
    radioButtons: RadioButtonInput[];
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
