import { create } from "zustand"
import { supabase } from "../supabase-client"
import toast from "react-hot-toast"

export const useJobs = create((set,get) => ({
    // Jobs list
    jobs:[],
    currentJob: null,
    loading: false,
    error: null,

    // job application form
    jobAppData: {
        company: '',
        title: '',
        job_link: '',
        date_applied: '',
        status: 'Applied',
        notes: ''
    },

    setJobData: ((jobAppData) => set({jobAppData})),
    resetForm: () => set({jobAppData:{company:'', title:'', job_link:'', date_applied:'', status:'Applied', notes:''}}),

    addJob: async(e) => {
        e.preventDefault()

        try{
            const { data } = await supabase.auth.getUser()
            const email = data.user?.email
            const jobData = {...get().jobAppData, email}
            const {error} = await supabase.from("jobs").insert(jobData).single()
            if (error) {
                console.error('addJob supabase error', error.message)
                return
            }
            get().resetForm()
            get().getJobs()
            toast.success('Job Application Added')


        }catch(err){
            console.log('addJob func went wrong ', err)
        }
    },

    getJobs: async() => {
        try{
            const { data: emailData } = await supabase.auth.getUser()
            const email = emailData.user?.email
            const {error, data} = await supabase.from('jobs').select("*").eq('email', email).order('created_at', {ascending: false})
            if(error){
                console.error('error in getJobs ', error.message)
                return
            }
            console.log(data)
            set({jobs:data})
        }catch(err){
            console.log('getJobs func went wrong ', err)
        }
    },

    getJob: async(id) => {
        try{
            const {error, data} = await supabase.from('jobs').select("*").eq('id', id).single()
            if(error){
                console.error('error in getJobs ', error.message)
                return
            }
            console.log(data)
            set({
                currentJob:data,
                jobAppData:data,
            })
        }catch(err){
            console.log('getJobs func went wrong ', err)
        }
    },

    deleteJob: async(id) => {
        try{

            const { error } = await supabase.from('jobs').delete().eq("id", id)
            if (error) {
                console.error('Error in deleteJob', error)
            }
            console.log('DELETE SUCCESSFUL')
            get().getJobs()
            toast.success('Job Application Deleted')
        }catch(err){
            console.log('delete')
        }
    },

    updateJob: async(id) => {
        try{
            const { error } = await supabase.from('jobs').update(get().jobAppData).eq("id", id)
            if (error) {
                console.error('Error in updateJob', error)
            }
            get().getJobs()
        }catch(err){
            console.log('updateJob')
        }
    }

}))