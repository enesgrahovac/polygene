"use client"
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/auth/client';
import { useRouter } from 'next/navigation'
import { getUserSubscriptionStatus, addUserdata } from '@/utils/user'
import { numberQuizzesInFreeTrial } from '@/utils/constants'

type UserContextType = {
    lastFileID: string;
    setLastFileID: (id: string) => void;
    userEmail?: string;
    userId?: string;
    isSubscribed?: boolean;
    hasUserPassedFreeTrial?: boolean;
    logOutUser?: () => void;
};

const defaultUserContext: UserContextType = {
    lastFileID: "",
    setLastFileID: () => { },
    userEmail: '',
    userId: '',

    isSubscribed: false,
    hasUserPassedFreeTrial: true,
    logOutUser: () => { }
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state without trying to access localStorage directly
    const [lastFileID, setLastFileID] = useState<string>(defaultUserContext.lastFileID);
    const [userEmail, setUserEmail] = useState<string>('')
    const [userId, setUserId] = useState<string>('')
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
    const [hasUserPassedFreeTrial, setHasUserPassedFreeTrial] = useState<boolean>(false)
    const supabase = createClient();
    const router = useRouter()

    const logOutUser = async () => {
        setUserId('')
        setUserEmail('')
        setIsSubscribed(false)
    }

    const checkSubscription = async () => {
        const userSub = await getUserSubscriptionStatus(userId);

        setIsSubscribed(userSub['isPremium'])
    }

    useEffect(() => {
        if (userId) {
            checkSubscription()
        }
    }, [userId])

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data?.user) {
            // router.push(`/auth`)
            return
        }

        if (!data.user?.email) {
            return
        }

        setUserEmail(data.user.email)
        setUserId(data.user.id)
        const userData = {
            userId: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name,
            fullName: data.user.user_metadata?.full_name,

        }
        addUserdata(userData)
    }

    useEffect(() => {
        getUser()
    }, [supabase.auth])

    useEffect(() => {
        // Attempt to read from localStorage only after component mounts
        const storedID = localStorage.getItem('lastFileID');
        if (storedID) {
            setLastFileID(storedID);
        }
    }, []);

    useEffect(() => {
        // Save to local storage whenever lastFileID changes
        localStorage.setItem('lastFileID', lastFileID);
    }, [lastFileID]);

    return (
        <UserContext.Provider value={{ lastFileID, setLastFileID, userEmail, userId, isSubscribed, hasUserPassedFreeTrial, logOutUser }}>
            {children}
        </UserContext.Provider>
    );
};