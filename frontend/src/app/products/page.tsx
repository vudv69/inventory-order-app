"use client";

import { useLogout } from "@refinedev/core";
import { capitalizeFirstLetter } from "@utils/string";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "sonner";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
  },
});

export default function ProductsPage() {
  const { mutate: logout } = useLogout();

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("auth")
    ? JSON.parse(Cookies.get("auth")!).accessToken
    : "";

  useEffect(() => {
    const auth = Cookies.get("auth");
    if (!auth) redirect("/login");
    else setUser(JSON.parse(auth));
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        filter,
        status,
      });
      const res = await fetch(
        `http://localhost:3001/v1/products?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        toast.error("Failed to load products");
        return;
      }

      const result = await res.json();
      setProducts(result.data?.data || []);
      setTotal(result.data?.total || 0);
    } catch (error) {
      toast.error("Error while fetching products!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, status]);

  useEffect(() => {
    fetchProducts();
  }, [page, filter, status]);

  // -------- Dialog Handlers --------
  const openCreateDialog = () => {
    setSelectedProduct({
      name: "",
      sku: "",
      price: "",
      inventoryCount: 0,
      status: "ACTIVE",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const url = isEditing
        ? `http://localhost:3001/v1/products/${selectedProduct.id}`
        : "http://localhost:3001/v1/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...selectedProduct,
          price: Number(selectedProduct.price),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to save product");
        return;
      }

      toast.success(
        isEditing
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      setDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Something went wrong while saving product!");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3001/v1/products/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to delete product");
        return;
      }

      toast.success("Product deleted!");
      setConfirmOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Something went wrong while deleting product!");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            Products
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <Typography>
                Hello, <b>{user.username}</b> — Role:{" "}
                {capitalizeFirstLetter(user.role)}
              </Typography>
            )}
            <Button
              variant="contained"
              color="error"
              onClick={() => logout()}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          {/* Left side: search + status */}
          <Box display="flex" gap={2}>
            <TextField
              label="Search by name or sku"
              variant="outlined"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Right side: button */}
          {user?.role === "MANAGER" && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={openCreateDialog}
              sx={{ textTransform: "none" }}
            >
              Create
            </Button>
          )}
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>SKU</b>
                </TableCell>
                <TableCell>
                  <b>Price (USD)</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell>
                  <b>Stock</b>
                </TableCell>
                {user?.role === "MANAGER" && (
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.price}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color: p.status === "ACTIVE" ? "green" : "gray",
                          fontWeight: 600,
                        }}
                      >
                        {capitalizeFirstLetter(p.status)}
                      </span>
                    </TableCell>
                    <TableCell>{p.inventoryCount}</TableCell>
                    {user?.role === "MANAGER" && (
                      <TableCell>
                        <IconButton
                          color="warning"
                          onClick={() => openEditDialog(p)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(p)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>

        {/* ---------------- Dialog: Create/Edit ---------------- */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name"
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <TextField
              label="SKU"
              value={selectedProduct?.sku || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, sku: e.target.value })
              }
            />
            <TextField
              label="Price"
              type="number"
              value={selectedProduct?.price || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
            />
            <TextField
              label="Inventory"
              type="number"
              value={selectedProduct?.inventoryCount || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  inventoryCount: parseInt(e.target.value),
                })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedProduct?.status || "ACTIVE"}
                label="Status"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogOpen(false)}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isEditing ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ---------------- Dialog: Confirm Delete ---------------- */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete “{selectedProduct?.name}”?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDelete}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
