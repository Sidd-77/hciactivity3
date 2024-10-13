"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import universityData from "./universityData.json";

type Classroom = {
  building: string;
  room: string;
  capacity: number;
};

type Department = {
  name: string;
  building: string;
  budget: number;
  faculty: number;
  students: number;
};

type Course = {
  id: string;
  title: string;
  department: string;
  credits: number;
  enrollment: number;
  semester: number;
};

type Instructor = {
  id: string;
  name: string;
  department: string;
  salary: number;
  courses: number;
  publications: number;
};

type UniversityData = {
  classrooms: Classroom[];
  departments: Department[];
  courses: Course[];
  instructors: Instructor[];
};

type SearchType = "classrooms" | "departments" | "courses" | "instructors";

type Range = {
  min: string;
  max: string;
};

const typedUniversityData = universityData as UniversityData;

export default function Component() {
  const [activeSearch, setActiveSearch] = useState<SearchType>("classrooms");
  const [searchResults, setSearchResults] = useState<
    (Classroom | Department | Course | Instructor)[]
  >([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityRange, setCapacityRange] = useState<Range>({
    min: "",
    max: "",
  });
  const [budgetRange, setBudgetRange] = useState<Range>({ min: "", max: "" });
  const [creditRange, setCreditRange] = useState<Range>({ min: "", max: "" });
  const [salaryRange, setSalaryRange] = useState<Range>({ min: "", max: "" });

  const buildings = useMemo(() => {
    const buildingSet = new Set<string>();
    typedUniversityData.classrooms.forEach((c) => buildingSet.add(c.building));
    return Array.from(buildingSet);
  }, []);
  const departments = useMemo(
    () => typedUniversityData.departments.map((d) => d.name),
    []
  );

  const handleSearch = () => {
    let results: (Classroom | Department | Course | Instructor)[] = [];
    switch (activeSearch) {
      case "classrooms":
        results = typedUniversityData.classrooms.filter((classroom) => {
          const buildingMatch =
            !selectedBuilding || classroom.building === selectedBuilding;
          const roomMatch =
            !searchTerm ||
            classroom.room.toLowerCase().includes(searchTerm.toLowerCase());
          const capacityMatch =
            (!capacityRange.min ||
              classroom.capacity >= parseInt(capacityRange.min)) &&
            (!capacityRange.max ||
              classroom.capacity <= parseInt(capacityRange.max));
          return buildingMatch && roomMatch && capacityMatch;
        });
        break;
      case "departments":
        results = typedUniversityData.departments.filter((department) => {
          const nameMatch =
            !searchTerm ||
            department.name.toLowerCase().includes(searchTerm.toLowerCase());
          const buildingMatch =
            !selectedBuilding || department.building === selectedBuilding;
          const budgetMatch =
            (!budgetRange.min ||
              department.budget >= parseInt(budgetRange.min)) &&
            (!budgetRange.max ||
              department.budget <= parseInt(budgetRange.max));
          return nameMatch && buildingMatch && budgetMatch;
        });
        break;
      case "courses":
        results = typedUniversityData.courses.filter((course) => {
          const titleMatch =
            !searchTerm ||
            course.title.toLowerCase().includes(searchTerm.toLowerCase());
          const departmentMatch =
            !selectedDepartment || course.department === selectedDepartment;
          const creditMatch =
            (!creditRange.min || course.credits >= parseInt(creditRange.min)) &&
            (!creditRange.max || course.credits <= parseInt(creditRange.max));
          return titleMatch && departmentMatch && creditMatch;
        });
        break;
      case "instructors":
        results = typedUniversityData.instructors.filter((instructor) => {
          const nameMatch =
            !searchTerm ||
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
          const departmentMatch =
            !selectedDepartment || instructor.department === selectedDepartment;
          const salaryMatch =
            (!salaryRange.min ||
              instructor.salary >= parseInt(salaryRange.min)) &&
            (!salaryRange.max ||
              instructor.salary <= parseInt(salaryRange.max));
          return nameMatch && departmentMatch && salaryMatch;
        });
        break;
    }
    setSearchResults(results);
  };

  const renderSearchOptions = () => {
    switch (activeSearch) {
      case "classrooms":
        return (
          <div className="space-y-4">
            <Select onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select building" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building} value={building}>
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Room number"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Min capacity"
                type="number"
                className="w-full"
                value={capacityRange.min}
                onChange={(e) =>
                  setCapacityRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <Input
                placeholder="Max capacity"
                type="number"
                className="w-full"
                value={capacityRange.max}
                onChange={(e) =>
                  setCapacityRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>
        );
      case "departments":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Department name"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select building" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building} value={building}>
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Input
                placeholder="Min budget"
                type="number"
                className="w-full"
                value={budgetRange.min}
                onChange={(e) =>
                  setBudgetRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <Input
                placeholder="Max budget"
                type="number"
                className="w-full"
                value={budgetRange.max}
                onChange={(e) =>
                  setBudgetRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>
        );
      case "courses":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Course title or ID"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Input
                placeholder="Min credits"
                type="number"
                className="w-full"
                value={creditRange.min}
                onChange={(e) =>
                  setCreditRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <Input
                placeholder="Max credits"
                type="number"
                className="w-full"
                value={creditRange.max}
                onChange={(e) =>
                  setCreditRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>
        );
      case "instructors":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Instructor name or ID"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Input
                placeholder="Min salary"
                type="number"
                className="w-full"
                value={salaryRange.min}
                onChange={(e) =>
                  setSalaryRange((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <Input
                placeholder="Max salary"
                type="number"
                className="w-full"
                value={salaryRange.max}
                onChange={(e) =>
                  setSalaryRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderVisualization = () => {
    switch (activeSearch) {
      case "classrooms":
        const classroomData = buildings.map((building) => {
          const rooms = typedUniversityData.classrooms.filter(
            (c) => c.building === building
          );
          return {
            building,
            smallRooms: rooms.filter((r) => r.capacity <= 25).length,
            mediumRooms: rooms.filter(
              (r) => r.capacity > 25 && r.capacity <= 50
            ).length,
            largeRooms: rooms.filter((r) => r.capacity > 50).length,
          };
        });

        return (
          <Card className="bg-card border border-muted">
            <CardHeader>
              <CardTitle className="text-primary">
                Classroom Distribution by Building
              </CardTitle>
              <CardDescription>
                Overview of room sizes across buildings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  smallRooms: {
                    label: "Small Rooms",
                    color: "hsl(var(--chart-1))",
                  },
                  mediumRooms: {
                    label: "Medium Rooms",
                    color: "hsl(var(--chart-2))",
                  },
                  largeRooms: {
                    label: "Large Rooms",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classroomData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--muted))"
                    />
                    <XAxis
                      dataKey="building"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="smallRooms"
                      stackId="a"
                      fill="hsl(var(--chart-1))"
                    />
                    <Bar
                      dataKey="mediumRooms"
                      stackId="a"
                      fill="hsl(var(--chart-2))"
                    />
                    <Bar
                      dataKey="largeRooms"
                      stackId="a"
                      fill="hsl(var(--chart-3))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4">
                <Select onValueChange={setSelectedBuilding}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building} value={building}>
                        {building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDataPoint && (
                <div className="mt-4 p-4 border border-muted rounded-md bg-secondary">
                  <h3 className="font-bold text-primary">
                    {selectedDataPoint.building}
                  </h3>
                  <p>Small Rooms: {selectedDataPoint.smallRooms}</p>
                  <p>Medium Rooms: {selectedDataPoint.mediumRooms}</p>
                  <p>Large Rooms: {selectedDataPoint.largeRooms}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "departments":
        return (
          <Card className="bg-card border border-muted">
            <CardHeader>
              <CardTitle className="text-primary">
                Department Budget and Size Comparison
              </CardTitle>
              <CardDescription>
                Overview of department budgets, faculty, and students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  budget: { label: "Budget", color: "hsl(var(--chart-1))" },
                  faculty: { label: "Faculty", color: "hsl(var(--chart-2))" },
                  students: { label: "Students", color: "hsl(var(--chart-3))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typedUniversityData.departments}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--muted))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="hsl(var(--chart-1))"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--chart-2))"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />

                    <Bar
                      yAxisId="left"
                      dataKey="budget"
                      fill="hsl(var(--chart-1))"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="faculty"
                      fill="hsl(var(--chart-2))"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="students"
                      fill="hsl(var(--chart-3))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4">
                <Select onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDataPoint && (
                <div className="mt-4 p-4 border border-muted rounded-md bg-secondary">
                  <h3 className="font-bold text-primary">
                    {selectedDataPoint.name}
                  </h3>
                  <p>Budget: ${selectedDataPoint.budget.toLocaleString()}</p>
                  <p>Faculty: {selectedDataPoint.faculty}</p>
                  <p>Students: {selectedDataPoint.students}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "courses":
        return (
          <Card className="bg-card border border-muted">
            <CardHeader>
              <CardTitle className="text-primary">
                Course Enrollment and Credits
              </CardTitle>
              <CardDescription>
                Overview of course enrollment and credit hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  enrollment: {
                    label: "Enrollment",
                    color: "hsl(var(--chart-1))",
                  },
                  credits: { label: "Credits", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid stroke="hsl(var(--muted))" />
                    <XAxis
                      type="number"
                      dataKey="credits"
                      name="Credits"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      type="number"
                      dataKey="enrollment"
                      name="Enrollment"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter
                      name="Courses"
                      data={typedUniversityData.courses}
                      fill="hsl(var(--chart-1))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4">
                <Select onValueChange={(value) => console.log(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedDataPoint && (
                <div className="mt-4 p-4 border border-muted rounded-md bg-secondary">
                  <h3 className="font-bold text-primary">
                    {selectedDataPoint.title}
                  </h3>
                  <p>Course ID: {selectedDataPoint.id}</p>
                  <p>Credits: {selectedDataPoint.credits}</p>
                  <p>Enrollment: {selectedDataPoint.enrollment}</p>
                  <p>Semester: {selectedDataPoint.semester}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "instructors":
        return (
          <Card className="bg-card border border-muted">
            <CardHeader>
              <CardTitle className="text-primary">
                Instructor Salary and Publications
              </CardTitle>
              <CardDescription>
                Overview of instructor salaries and publication counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  salary: { label: "Salary", color: "hsl(var(--chart-1))" },
                  publications: {
                    label: "Publications",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid stroke="hsl(var(--muted))" />
                    <XAxis
                      type="number"
                      dataKey="salary"
                      name="Salary"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      type="number"
                      dataKey="publications"
                      name="Publications"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter
                      name="Instructors"
                      data={typedUniversityData.instructors}
                      fill="hsl(var(--chart-1))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4">
                <Select onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDataPoint && (
                <div className="mt-4 p-4 border border-muted rounded-md bg-secondary">
                  <h3 className="font-bold text-primary">
                    {selectedDataPoint.name}
                  </h3>
                  <p>Department: {selectedDataPoint.department}</p>
                  <p>Salary: ${selectedDataPoint.salary.toLocaleString()}</p>
                  <p>Courses: {selectedDataPoint.courses}</p>
                  <p>Publications: {selectedDataPoint.publications}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8 bg-background text-foreground border-muted">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        University Information System
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border border-muted">
          <CardHeader>
            <CardTitle className="text-primary">Information Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Select
                onValueChange={(value: SearchType) => {
                  setActiveSearch(value);
                  setSearchResults([]);
                  setSearchTerm("");
                  setSelectedBuilding("");
                  setSelectedDepartment("");
                  setCapacityRange({ min: "", max: "" });
                  setBudgetRange({ min: "", max: "" });
                  setCreditRange({ min: "", max: "" });
                  setSalaryRange({ min: "", max: "" });
                }}
                value={activeSearch}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select search type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classrooms">Classroom Search</SelectItem>
                  <SelectItem value="departments">Department Search</SelectItem>
                  <SelectItem value="courses">Course Search</SelectItem>
                  <SelectItem value="instructors">Instructor Search</SelectItem>
                </SelectContent>
              </Select>
              {renderSearchOptions()}
              <Button className="w-full" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-muted">
          <CardHeader>
            <CardTitle className="text-primary">Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="border border-muted">
                <TableHeader>
                  <TableRow className="border-b border-muted">
                    {searchResults.length > 0 &&
                      Object.keys(searchResults[0]).map((key) => (
                        <TableHead
                          key={key}
                          className="text-muted-foreground border-r border-muted last:border-r-0"
                        >
                          {key}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-muted last:border-b-0"
                    >
                      {Object.entries(result).map(([key, value], i) => (
                        <TableCell
                          key={i}
                          className="border-r border-muted last:border-r-0"
                        >
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-primary">
          Data Visualization
        </h2>
        {renderVisualization()}
      </div>
    </div>
  );
}
