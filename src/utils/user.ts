export const getUserSubscriptionStatus = async (userId:string) => {
    const response = await fetch(`/api/user/subscription/${userId}`);
    const data = await response.json();
    return data;
}

export const addUserdata = async (userData:any) => {
    const response = await fetch(`/api/user/add-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
}