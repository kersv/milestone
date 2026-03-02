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
        date_applied: new Date().toLocaleDateString('en-CA'),
        status: 'Applied',
        notes: ''
    },

    setJobData: ((jobAppData) => set({jobAppData})),
    resetForm: () => set({jobAppData:{company:'', title:'', job_link:'', date_applied: new Date().toLocaleDateString('en-CA'), status:'Applied', notes:''}}),

    addJob: async(e) => {
        e.preventDefault()
        try{
            const { data } = await supabase.auth.getUser()
            const email = data.user?.email
            const jobData = {...get().jobAppData, email}
            const {error} = await supabase.from("jobs").insert(jobData).single()
            if (error) {
                toast.error('Failed to add job application')
                return
            }
            get().resetForm()
            get().getJobs()
            toast.success('Job Application Added')
        }catch(err){
            toast.error('Something went wrong')
        }
    },

    getJobs: async() => {
        try{
            const { data: emailData } = await supabase.auth.getUser()
            const email = emailData.user?.email
            const {error, data} = await supabase.from('jobs').select("*").eq('email', email).order('created_at', {ascending: false})
            if(error){
                set({ error: error.message })
                return
            }
            set({jobs:data, error: null})
        }catch(err){
            set({ error: 'Failed to load jobs' })
        }
    },

    getJob: async(id) => {
        set({ loading: true, error: null })
        try{
            const { data: emailData } = await supabase.auth.getUser()
            const email = emailData.user?.email
            const {error, data} = await supabase.from('jobs').select("*").eq('id', id).eq('email', email).single()
            if(error){
                set({ error: error.message })
                return
            }
            set({
                currentJob:data,
                jobAppData:data,
            })
        }catch(err){
            set({ error: 'Failed to load job' })
        } finally {
            set({ loading: false })
        }
    },

    deleteJob: async(id) => {
        try{
            const { data: emailData } = await supabase.auth.getUser()
            const email = emailData.user?.email
            const { error } = await supabase.from('jobs').delete().eq("id", id).eq("email", email)
            if (error) {
                toast.error('Failed to delete job application')
                return
            }
            get().getJobs()
            toast.success('Job Application Deleted')
        }catch(err){
            toast.error('Something went wrong')
        }
    },

    updateJob: async(id) => {
        try{
            const {data: emailData } = await supabase.auth.getUser()
            const email = emailData.user?.email
            const { error } = await supabase.from('jobs').update(get().jobAppData).eq("id", id).eq("email", email)
            if (error) {
                toast.error('Failed to update Job Application')
                return
            }
            toast.success('Job Application Updated')
            get().getJobs()
        }catch(err){
            toast.error('Something went wrong')
        }
    }

}))
