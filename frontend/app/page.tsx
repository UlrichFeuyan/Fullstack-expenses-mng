"use client";

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
};

export default function Home() {
  // Définition du setteur pour les transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fonction permettant de récupérer la liste des transactions depuis le backend
  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/");
      setTransactions(res.data);
      toast.success("Transactions chargées");
    } catch (error) {
      console.error("Erreur chargement transactions", error);
      toast.error("Erreur de chargement");
    }
  };

  // Fonction permettant de supprimer une transaction à partir de son id via call api et la faire disparaître côté frontend
  const deleteTransactions = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`);
      getTransactions();
      toast.success("Transaction supprimée avec succès");
    } catch (error) {
      console.error("Erreur suppression transaction", error);
      toast.error("Erreur suppression transaction");
    }
  };

  // Utilisons le hook useEffect pour appeller la fonction getTransactions au lancement de la page
  useEffect(() => {
    getTransactions();
  }, []);

  // Quelques calcul statistiques
  const amounts = transactions.map((t) => Number(t.amount) || 0); // Tableau contenant le montant de chaque transaction (ou zéro si la transaction n'en a pas)
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0; // Calcul du solde du compte en sommant les montants des transactions successives (qui seront positif pour les dépots et négatifs pour les retraits), ce solde étant initialement à zéro avant le calcul
  const income =
    amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0; // Cacul du montant de l'ensemble des entrées (transactions positives)
  const expense =
    amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0; // Cacul du montant de l'ensemble des dépenses (transactions négatives)
  const ratio =
    income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0; // Cacul du pourcentage de dépense

  // Fonction permettant de formatter la date (qu'on récupère sous forme de string dans la réponse) sous un format francophone
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex flex-col gap-1">
          <div className="badge badge-soft">
            <Wallet className="w-4 h-4" />
            Votre solde
          </div>
          <div className="stat-value">{balance.toFixed(2)} ₿</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-success">
            <ArrowUpCircle className="w-4 h-4" />
            Revenus
          </div>
          <div className="stat-value">{income.toFixed(2)} ₿</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-error">
            <ArrowDownCircle className="w-4 h-4" />
            Dépenses
          </div>
          <div className="stat-value">{expense.toFixed(2)} ₿</div>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex justify-between items-center mb-1">
          <div className="badge badge-soft badge-warning gap-1">
            <Activity className="h-4 w-4" />
            Pourcentage des dépenses
          </div>
          <div>{ratio.toFixed(0)}%</div>
        </div>
        <progress
          className="progress progress-warning w-full"
          value={ratio}
          max={100}
        ></progress>
      </div>

      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()}
      >
        open modal
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>

      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id}>
                <th>{index + 1}</th>
                <td>{t.text}</td>
                <td>
                  {t.amount > 0 ? (
                    <TrendingUp className="text-success h-6 w-6" />
                  ) : (
                    <TrendingDown className="text-error h-6 w-6" />
                  )}
                </td>
                <td>{t.created_at}</td>
                <td>
                  <button
                    className="btn btn-sm btn-soft btn-error"
                    title="Supprimer"
                    onClick={() => deleteTransactions(t.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
