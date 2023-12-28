// useValidation.ts
export const validateEmail = (rule: any, value: any, callback: any) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (value === '') {
        callback(new Error('Please input the email'))
    } else {
        if (!regex.test(value)) {
            callback(new Error('Please input the valid email'))
            
        }
        callback()
    }
}

export const validatePass = (rule: any, value: any, callback: any) => {
    if (value.trim() === '') {
        callback(new Error('Please input the password'))
    } else {
        callback()
    }
}

export const validatePass2 = (pass1: string) => {
    console.log('pass1:'+pass1)
    return (rule: any, value: any, callback: any) => {
        console.log('value:'+value)
        
        if (value.trim() === '') {
            callback(new Error('Please confirm the password'));
        } else if (value.trim() !== pass1.trim()) {
            callback(new Error('Passwords do not match'));
        } else {
            callback();
        }
    };
}