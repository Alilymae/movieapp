import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

// CONTAINER
const Container = ({ header, children }) => {
    return (
        <Box sx={{
            marginTop: header ? "5rem" : "0",
            marginX: "auto",
            maxWidth: "1366px",
            width: "100%",
            paddingX: { xs: "30px", md: 0 },
            color: "text.primary"
        }}>
            <Stack spacing={4}>
                {header && (
                    <Box sx={{
                        position: "relative",
                        paddingX: { xs: "20px", md: 0 },
                        maxWidth: "1366px",
                        marginX: "auto",
                        width: "100%",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: { xs: "20px", md: "0" },
                            top: "100%",
                            height: "5px",
                            width: "100px",
                            backgroundColor: "primary.main"
                        }
                    }}>
                        <Typography variant="h5" fontWeight="700" textTransform="uppercase">
                            {header}
                        </Typography>
                    </Box>
                )}
                {children}
            </Stack>
        </Box>
    );
};

export default Container;