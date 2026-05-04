import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import Pagination from "../components/Pagination";
import { secretaryService } from "@/lib/api-secretaries";
import { Secretary } from "@/types/secretary";

import "./ListePage.css";

const ITEMS_PER_PAGE = 10;

export default function ListeSecretaires() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [secretaires, setSecretaires] = useState<Secretary[]>([]);
  const [loading, setLoading] = useState(true);

  // MODALS
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // FORM
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [selectedSecretary, setSelectedSecretary] =
    useState<Secretary | null>(null);

  // FETCH
  const fetchSecretaires = async () => {
    try {
      setLoading(true);
      const data = await secretaryService.getAll();
      setSecretaires(data);
    } catch (error) {
      console.error("Erreur chargement secrétaires :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretaires();
  }, []);

  // SEARCH
  const filtered = secretaires.filter((s) => {
    return (
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // PAGINATION
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // CREATE
  const handleCreate = async () => {
    try {
      await secretaryService.create({
        username: formData.username,
        email: formData.email,
      });

      setShowCreateModal(false);

      setFormData({
        username: "",
        email: "",
      });

      fetchSecretaires();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
    }
  };

  // OPEN EDIT
  const handleOpenEdit = (secretary: Secretary) => {
    setSelectedSecretary(secretary);

    setFormData({
      username: secretary.username,
      email: secretary.email,
    });

    setShowEditModal(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!selectedSecretary) return;
    console.log("TOKEN =", localStorage.getItem("token"));

    try {
      await secretaryService.update(selectedSecretary.id, {
        ...selectedSecretary,
        username: formData.username,
        email: formData.email,
      });

      setShowEditModal(false);

      fetchSecretaires();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const firstConfirm = window.confirm(
      "Voulez-vous vraiment supprimer ce secrétaire ?"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "Cette action est irréversible. Confirmer ?"
    );

    if (!secondConfirm) return;

    try {
      await secretaryService.delete(id);

      fetchSecretaires();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des secrétaires</h1>
          <p className="breadcrumb">
            Tableau de bord › Secrétaires
          </p>
        </div>

        <button
          className="btn-primary"
          type="button"
          // onClick={() => setShowCreateModal(true)}
          onClick={() => {
            setFormData({
              username: "",
              email: "",
            });

            setShowCreateModal(true);
          }}
        >
          <Plus size={16} />
          Ajouter un secrétaire
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />

            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>E-mail</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Chargement...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Aucun secrétaire trouvé
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>

                  <td>
                    <strong>{s.username}</strong>
                  </td>

                  <td className="text-muted">
                    {s.email}
                  </td>

                  <td>
                    <div className="actions-cell">
                      {/* <button
                        className="action-btn view"
                        type="button"
                      >
                        <Eye size={15} />
                      </button> */}

                      <button
                        className="action-btn edit"
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="action-btn delete"
                        type="button"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-modal-header">
              <h2>Ajouter un secrétaire</h2>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setShowCreateModal(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="custom-modal-body">
              <div className="form-group">
                <label>Username</label>

                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  placeholder="Votre username"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Votre adresse email"
                />
              </div>
            </div>

            <div className="custom-modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setShowCreateModal(false)
                }
              >
                Annuler
              </button>

              <button
                className="btn-primary"
                onClick={handleCreate}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-modal-header">
              <h2>Modifier le secrétaire</h2>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="custom-modal-body">
              <div className="form-group">
                <label>Username</label>

                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="custom-modal-footer">
              <button
                className="btn-secondary"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Annuler
              </button>

              <button
                className="btn-primary"
                onClick={handleUpdate}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLE */}
      <style>
        {`
          .custom-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            backdrop-filter: blur(3px);
          }

          .custom-modal {
            width: 420px;
           
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            animation: modalShow 0.2s ease;
          }

          @keyframes modalShow {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0px) scale(1);
            }
          }

          .custom-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 20px;
            border-bottom: 1px solid #eee;
          }

          .custom-modal-header h2 {
            font-size: 1rem;
            margin: 0;
          }

          .modal-close-btn {
            border: none;
            // background: #f5f5f5;
            width: 34px;
            height: 34px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .custom-modal-body {
            padding: 20px;
          }

          .form-group {
            margin-bottom: 18px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .form-group input {
            width: 100%;
            height: 42px;
            border-radius: 10px;
            border: 1px solid #ddd;
            padding: 0 12px;
            outline: none;
            transition: 0.2s;
            background: none;
          }

          .form-group input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
          }

          .custom-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 18px 20px;
            border-top: 1px solid #eee;
          }
        `}
      </style>
    </div>
  );
}