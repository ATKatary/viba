/*** Login ***/
export type signFormFieldType = {
    value: string 
    message?: string 
}

export type signinFormType = {
    email: signFormFieldType
    password: signFormFieldType
};

export type signupFormType = {
    email: signFormFieldType
    lastName: signFormFieldType
    firstName: signFormFieldType

    password: signFormFieldType
    confirmPassword: signFormFieldType
};

/*** Fields ***/