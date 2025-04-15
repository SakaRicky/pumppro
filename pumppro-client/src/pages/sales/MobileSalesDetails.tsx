import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSale } from 'services/sales';
import { Sale } from 'types';
import CircularProgress from '@mui/material/CircularProgress';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import withAuth from 'hoc/withAuth';

const MobileSalesDetailsPage = () => {
    const { saleId } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();

    const isMobile = useMediaQuery("(max-width: 768px)");

    const fetchForSale = async () => {
        let fetchedSale = null;
        if (saleId) {
            fetchedSale = await getSale(saleId);
        }
        setSale(fetchedSale);
    }

    useEffect(() => {
        fetchForSale();
        setLoading(false);
    }, [saleId]);


    const handleGoBack = () => {
        navigate(-1);
    };

    const columns: GridColDef[] = [
        {
            field: "product",
            headerName: "Item",
            width: 180,
            headerAlign: "center",
            align: "center",
            renderCell: params => {
                return params.row.product.name;
            }
        },
        {
            field: "category",
            headerName: "Category",
            width: 180,
            headerAlign: "center",
            align: "center",
            renderCell: params => {
                return params.row.product.category.name;
            }
        },
        {
            field: "selling_price",
            headerName: "Unit Price(XAF)",
            width: 120,
            headerAlign: "center",
            align: "center",
            renderCell: params => {
                return params.row.product.selling_price;
            }
        },
        {
            field: "quantity",
            headerName: "Quantity",
            width: 100,
            headerAlign: "center",
            align: "center"
        }
    ];

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: "center" }}>
            <CircularProgress />
        </Box>
    }

    if (!sale) {
        return <Box><Typography fontSize={"2rem"}>Sale not found.</Typography></Box>
    }

    if (!isMobile) {
        navigate("/sales")
    }

    return (
        <Box sx={{ p: 2, height: "60vh", width: "100%", backgroundColor: theme.palette.background.alt, }}>
            <Box>
                <IconButton aria-label="delete" onClick={handleGoBack} sx={{ backgroundColor: theme.palette.secondary.main }}>
                    <ArrowBackIosNewIcon />
                </IconButton>
            </Box>
            <Box mt={"2rem"} height={"100%"}>
                <Typography
                    component="span"
                    fontSize="1.2rem"
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}
                >
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FormattedMessage
                                id="salesdetailpage.doneby"
                                defaultMessage="By: "
                            />
                            <Typography color={theme.palette.primary[500]} ml={1} fontSize="inherit">
                                {sale.user.names}
                            </Typography>
                        </Box>
                        {moment(sale.created_at).format("DD/MM/YYYY")}{" "}
                    </Box>

                    <Typography color={theme.palette.primary[500]} fontSize="1.5rem" fontWeight={"Bold"}>
                        <FormattedMessage id="salesdetailpage.total" defaultMessage="Total" />{" "}
                        XAF {sale.total}
                    </Typography>
                </Typography>

                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        "& .MuiDataGrid-root": {
                            border: `4px solid ${theme.palette.secondary.main}`
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[200],
                            borderBottom: "none"
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${theme.palette.secondary[100]} !important`
                        },
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        ".MuiDataGrid-footerContainer": {
                            display: "none"
                        }
                    }}
                >
                    <DataGrid
                        rows={sale.sale_details}
                        columns={columns}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default withAuth(MobileSalesDetailsPage)
