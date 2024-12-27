import RadioButtonProps from "@/models/component-props/radio-button-props";

const radioButtonLabelClasses = `font-nunito textshadow text-xl hover:cursor-pointer w-fit flex items-center`;
const radioButtonClasses = `appearance-none peer`;
const radioButtonSpanClasses = `w-4 h-4 mr-2 rounded-full border-solid border-[2px] border-white shadow-lg shadow-indigo-500/50 peer-checked:bg-buttonprimary hover:bg-buttonprimaryhover`;

  /**
   * Needs to wrapped in a form HTML element.
   */
export default function RadioButton(radioButtonProps: RadioButtonProps) {

    return (
        <div className="flex flex-col gap-5">
            <div className="text-5xl">{radioButtonProps.main_label}</div>
            {radioButtonProps.radioButtons.map((radioButton, index) => (
                <label key={index} className={radioButtonLabelClasses}>
                    <input
                        className={radioButtonClasses}
                        type="radio"
                        name={radioButtonProps.name}
                        value={radioButton.value}
                        defaultChecked={radioButton.defaultChecked}
                    />
                    <span className={radioButtonSpanClasses}></span>
                    <span className="ml-2">{radioButton.label}</span>
                </label>
            ))}
        </div>
    );
}