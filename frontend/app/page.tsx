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

  // Quelques calcul statistiques
  const amounts = transactions.map((t) => Number(t.amount) || 0) // Tableau contenant le montant de chaque transaction (ou zéro si la transaction n'en a pas)
  const balance = amounts.reduce((acc, item) => acc + item , 0) || 0 // Calcul du solde du compte en sommant les montants des transactions successives (qui seront positif pour les dépots et négatifs pour les retraits), ce solde étant initialement à zéro avant le calcul
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item , 0) || 0 // Cacul du montant de l'ensemble des entrées (transactions positives)
  const expense = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item , 0) || 0 // Cacul du montant de l'ensemble des dépenses (transactions négatives)
  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0 // Cacul du pourcentage de dépense


  return (
    <div className="btn btn-sm">
      test
    </div>
  );
}
