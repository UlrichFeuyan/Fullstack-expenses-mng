"use client"

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";


type Transaction = {
  id: String,
  text: String,
  amount: Number,
  created_at: String,
}


export default function Home() {
  // Définition du setteur pour les transactions
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Fonction permettant de récupérer la liste des transactions depuis le backend
  const getTransactions = async () => {
    try {
        const res = await api.get<Transaction[]>("transactions/")
        setTransactions(res.data)
        toast.success("Transactions chargées")
    } catch (error) {
      console.error("Erreur chargement transactions" ,error);
      toast.error("Erreur de chargement")
    }
  }

  // Utilisons le hook useEffect pour appeller la fonction getTransactions au lancement de la page
  useEffect(() => {
    getTransactions()
  }, []);

  return (
    <div className="btn btn-sm">
      test
    </div>
  );
}
