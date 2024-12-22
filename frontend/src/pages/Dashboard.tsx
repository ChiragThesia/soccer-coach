import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';

const Dashboard = () => {
  const [athleteAge, setAthleteAge] = useState<number>(8);
  const [juggles, setJuggles] = useState<number>(0);
  const [kickDistance, setKickDistance] = useState<number>(10);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    console.log('Submitting:', {
      athleteAge,
      juggles,
      kickDistance,
      hasVideo: !!selectedFile,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Progress Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Record New Progress
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Athlete Age</InputLabel>
                <Select
                  value={athleteAge}
                  label="Athlete Age"
                  onChange={(e) => setAthleteAge(Number(e.target.value))}
                >
                  {Array.from({ length: 15 }, (_, i) => i + 4).map((age) => (
                    <MenuItem key={age} value={age}>
                      {age} years
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography gutterBottom>Number of Juggles</Typography>
              <Slider
                value={juggles}
                onChange={(_, value) => setJuggles(value as number)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>Kick Distance (yards)</Typography>
              <Slider
                value={kickDistance}
                onChange={(_, value) => setKickDistance(value as number)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Video Proof
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) =>
                    setSelectedFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Progress
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Progress Display */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Latest Achievement
                    </Typography>
                    <Typography variant="h5" component="div">
                      {juggles} Juggles
                    </Typography>
                    <Typography color="textSecondary">
                      Kick Distance: {kickDistance} yards
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* TODO: Add charts or more detailed progress views */}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
